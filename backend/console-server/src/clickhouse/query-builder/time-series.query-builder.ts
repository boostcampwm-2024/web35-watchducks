import type { MetricAggregationType, MetricFunction } from '../util/metric-expressions';
import { metricExpressions } from '../util/metric-expressions';
import { TimeSeriesQueryBuilderError } from './time-series-query-builder.error';

interface Metric {
    name: string;
    aggregation?: MetricAggregationType;
}

type FilterValue = string | number | Date | unknown;

export class TimeSeriesQueryBuilder {
    private query: string;
    private params: Record<string, unknown> = {};
    private limitValue?: number;

    constructor() {
        this.query = `SELECT`;
    }

    /**
     * @param interval Clickhouse interval format: '1 MINUTE', '5 MINUTE', '1 HOUR'
     */
    interval(interval: string): this {
        this.query += `
      toStartOf${interval}(timestamp) as timestamp`;

        return this;
    }

    /**
     * 쿼리에 메트릭을 추가하며, 선택적으로 집계 함수를 적용합니다.
     *
     * @param {Metric[]} metrics - 메트릭 이름과 선택적 집계 타입을 포함하는 메트릭 객체 배열
     * @returns {this} 메서드 체이닝을 위해 현재 인스턴스를 반환합니다
     * @throws {TimeSeriesQueryBuilderError} 지원하지 않는 집계 타입이 제공될 경우 에러를 발생시킵니다
     */
    metrics(metrics: Metric[]): this {
        const metricsQuery = metrics.map((metric) => this.buildMetricExpression(metric)).join(', ');

        this.query += ` ${metricsQuery}`;
        return this;
    }

    private buildMetricExpression(metric: Metric): string {
        if (!metric.aggregation) {
            return metric.name;
        }
        const expression = this.getAggregationExpression(metric.aggregation);

        return expression(metric.name);
    }

    private getAggregationExpression(aggregationType: MetricAggregationType): MetricFunction {
        const expression = metricExpressions[aggregationType];

        if (!expression) {
            throw new TimeSeriesQueryBuilderError(
                `지원하지 않는 집계 타입입니다: ${aggregationType}`,
            );
        }

        return expression;
    }

    /**
     * 쿼리에 FROM 절을 추가하여 대상 테이블을 지정합니다.
     *
     * @param {string} table - 조회할 테이블 이름
     * @returns {this} 메서드 체이닝을 위해 현재 인스턴스를 반환합니다
     * @throws {Error} 테이블 이름이 비어있거나 유효하지 않은 경우 에러를 발생시킵니다
     *
     * @example
     * // 기본 테이블 지정
     * queryBuilder.from('users')
     *
     * // 스키마가 포함된 테이블 지정
     * queryBuilder.from('public.users')
     */
    from(table: string): this {
        this.validateTableName(table);
        this.query += `\nFROM ${table}`;

        return this;
    }

    private validateTableName(table: string): void {
        if (!table || typeof table !== 'string' || !table.trim()) {
            throw new Error('유효한 테이블 이름을 입력해주세요.');
        }
    }

    /**
     * 특정 기간 동안의 데이터를 조회하기 위한 시간 범위 조건을 추가합니다.
     *
     * @param {Date} start - 조회 시작 시간
     * @param {Date} end - 조회 종료 시간
     * @param {string} columnName - 시간 정보 컬럼명 (default: timestamp)
     * @returns {this} 메서드 체이닝을 위해 현재 인스턴스를 반환합니다
     * @throws {TimeSeriesQueryBuilderError} 시작 시간이 종료 시간보다 늦거나, 유효하지 않은 Date 객체가 전달될 경우 에러를 발생시킵니다
     *
     * @example
     * // 특정 기간 데이터 조회
     * const start = new Date('2024-01-01');
     * const end = new Date('2024-01-02');
     * queryBuilder.timeBetween(start, end);
     */
    timeBetween(start: Date, end: Date, columnName: string = 'timestamp'): this {
        this.validateTimeRange(start, end);
        this.addTimeRangeSql(columnName);
        this.updateTimeParameters(start, end);

        return this;
    }

    private validateTimeRange(start: Date, end: Date): void {
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error('유효하지 않은 날짜 형식입니다.');
        }

        if (start >= end) {
            throw new Error('시작 시간은 종료 시간보다 이전이어야 합니다.');
        }
    }

    private addTimeRangeSql(columnName: string = 'timestamp'): void {
        const timeRangeCondition = this.query.includes('WHERE')
            ? `\nAND ${columnName} >= {startTime: DateTime64(3)} AND ${columnName} < {endTime: DateTime64(3)}`
            : `\nWHERE ${columnName} >= {startTime: DateTime64(3)} AND ${columnName} < {endTime: DateTime64(3)}`;

        this.query += timeRangeCondition;
    }

    private updateTimeParameters(start: Date, end: Date): void {
        this.params.startTime = start;
        this.params.endTime = end;
    }

    /**
     * 쿼리에 필터 조건을 추가합니다. 각 필터는 key-value 쌍으로 제공되며,
     * WHERE 절이나 AND 조건으로 자동 변환됩니다.
     *
     * @param {Record<string, unknown>} filters - 필터 조건을 담은 객체
     * @returns {this} 메서드 체이닝을 위해 현재 인스턴스를 반환합니다
     * @throws {TimeSeriesQueryBuilderError} 지원하지 않는 필터 값 타입이 제공될 경우 에러를 발생시킵니다
     *
     * @example
     * // 단일 필터 조건
     * queryBuilder.filter({ domain: 'example.com' })
     *
     * // 다중 필터 조건
     * queryBuilder.filter({
     *   host: 'host_001',
     *   name: 'project001',
     * })
     */
    filter(filters: Record<string, unknown>): this {
        if (!filters || Object.keys(filters).length === 0) {
            return this;
        }

        const conditions = this.buildFilterConditions(filters);
        this.appendFilterToQuery(conditions);

        return this;
    }

    private buildFilterConditions(filters: Record<string, unknown>): string[] {
        return Object.entries(filters).map(([key, value]) => {
            const { condition, param } = this.createFilterCondition(key, value);
            this.params[key] = param;
            return condition;
        });
    }

    private createFilterCondition(
        key: string,
        value: FilterValue,
    ): { condition: string; param: FilterValue } {
        const type = this.determineValueType(key, value);
        return { condition: `${key} = {${key}:${type}}`, param: value };
    }

    private determineValueType(key: string, value: FilterValue): string {
        if (typeof value === 'string') return 'String';
        if (typeof value === 'number') return this.getNumericType(value);
        if (value instanceof Date) return 'DateTime64(3)';

        throw new TimeSeriesQueryBuilderError(
            `지원하지 않는 필터 값 타입입니다. key: "${key}", type: ${typeof value}`,
        );
    }

    private getNumericType(value: number): string {
        return Number.isInteger(value) ? 'Int32' : 'Float64';
    }

    private appendFilterToQuery(conditions: string[]): void {
        const joinedConditions = conditions.join(' AND ');
        const whereClause = this.query.includes('WHERE')
            ? ` AND ${joinedConditions}`
            : ` WHERE ${joinedConditions}`;
        this.query += whereClause;
    }

    /**
     * 쿼리에 GROUP BY 절을 추가합니다.
     *
     * @param {string[]} groups - 그룹화할 컬럼명 배열
     * @returns {this} 메서드 체이닝을 위해 현재 인스턴스를 반환합니다
     * @throws {TimeSeriesQueryBuilderError} 빈 문자열이나 유효하지 않은 컬럼명이 포함된 경우 에러를 발생시킵니다
     *
     * @example
     * // 단일 컬럼 그룹화
     * queryBuilder.groupBy(['host'])
     *
     * // 다중 컬럼 그룹화
     * queryBuilder.groupBy(['host', 'name', 'domain'])
     */
    groupBy(groups: string[]): this {
        if (!this.isValidGroups(groups)) {
            return this;
        }

        this.validateGroupColumns(groups);
        this.query += ` GROUP BY ${groups.join(', ')}`;

        return this;
    }

    private isValidGroups(groups: string[]): boolean {
        return Array.isArray(groups) && groups.length > 0;
    }

    private validateGroupColumns(groups: string[]): void {
        const invalidColumns = groups.filter(
            (column) => !column || typeof column !== 'string' || !column.trim(),
        );

        if (invalidColumns.length > 0) {
            throw new TimeSeriesQueryBuilderError('유효하지 않은 그룹화 컬럼이 포함되어 있습니다.');
        }
    }

    /**
     * 쿼리에 ORDER BY 절을 추가하여 결과를 정렬합니다.
     *
     * @param {string[]} fields - 정렬할 필드명 배열
     * @param {boolean} desc - 내림차순 정렬 여부 (true: 내림차순, false: 오름차순)
     * @returns {this} 메서드 체이닝을 위해 현재 인스턴스를 반환합니다
     * @throws {TimeSeriesQueryBuilderError} 필드명이 비어있거나 유효하지 않은 경우 에러를 발생시킵니다
     *
     * @example
     * // 단일 필드 오름차순 정렬
     * queryBuilder.orderBy(['timestamp'], false)
     *
     * // 다중 필드 내림차순 정렬
     * queryBuilder.orderBy(['domain', 'timestamp'], true)
     */
    orderBy(fields: string[], desc: boolean = false): this {
        this.validateOrderFields(fields);
        this.appendOrderByClause(fields, desc);

        return this;
    }

    private validateOrderFields(fields: string[]): void {
        if (!Array.isArray(fields) || fields.length === 0) {
            throw new TimeSeriesQueryBuilderError('정렬할 필드를 1개 이상 지정해주세요.');
        }

        const invalidFields = fields.filter((field) => !field || !field.trim());
        if (invalidFields.length > 0) {
            throw new TimeSeriesQueryBuilderError('유효하지 않은 필드명이 포함되어 있습니다.');
        }
    }

    private appendOrderByClause(fields: string[], desc: boolean): void {
        const orderClause = ` ORDER BY ${fields.join(', ')}`;
        this.query += orderClause;

        if (desc) {
            this.query += ' DESC';
        }
    }

    /**
     * 쿼리 결과의 최대 행 수를 제한합니다.
     *
     * @param {number} value - 제한할 행의 수
     * @returns {this} 메서드 체이닝을 위해 현재 인스턴스를 반환합니다
     * @throws {TimeSeriesQueryBuilderError} limit 값이 양의 정수가 아닐 경우 에러를 발생시킵니다
     *
     * @example
     * // 상위 10개 결과만 조회
     * queryBuilder.limit(10)
     */
    limit(value: number): this {
        this.validateLimitValue(value);

        this.limitValue = value;
        return this;
    }

    private validateLimitValue(value: number): void {
        if (value < 0) {
            throw new TimeSeriesQueryBuilderError('limit 값은 0 이상이어야 합니다.');
        }

        if (!Number.isInteger(value)) {
            throw new TimeSeriesQueryBuilderError('limit 값은 정수여야 합니다.');
        }
    }

    build() {
        if (this.limitValue) {
            this.query += ` LIMIT ${this.limitValue}`;
        }

        if (process.env.NODE_ENV === 'development') {
            console.log(this.query);
        }

        return { query: this.query, params: this.params };
    }
}
