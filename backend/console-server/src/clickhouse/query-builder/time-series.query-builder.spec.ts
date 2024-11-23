import { TimeSeriesQueryBuilder } from './time-series.query-builder';
import { TimeSeriesQueryBuilderError } from './time-series-query-builder.error';

describe('TimeSeriesBuilder의', () => {
    let builder: TimeSeriesQueryBuilder;
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
        builder = new TimeSeriesQueryBuilder();
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    describe('interval() 메서드는', () => {
        it('주어진 interval 시간을 쿼리문에 추가해야한다', () => {
            const result = builder.interval('1 MINUTE').build();
            expect(result.query).toContain('toStartOf1 MINUTE(timestamp) as timestamp');
        });
    });

    describe('metrics() 메서드는', () => {
        it('집계함수가 없는 메트릭을 쿼리문에 추가해야한다', () => {
            const metrics = [{ name: 'cpu_usage' }];
            const result = builder.metrics(metrics).build();
            expect(result.query).toContain('cpu_usage');
        });

        it('집계함수가 있는 메트릭을 쿼리문에 추가해야한다', () => {
            const metrics = [{ name: 'cpu_usage', aggregation: 'avg' }];
            const result = builder.metrics(metrics).build();
            expect(result.query).toContain('avg(cpu_usage)');
        });

        it('올바르지 않은 집계함수에 대해 에러를 발생시켜야한다', () => {
            const metrics = [{ name: 'cpu_usage', aggregation: 'notSupported' }];
            expect(() => builder.metrics(metrics).build()).toThrow(TimeSeriesQueryBuilderError);
        });
    });

    describe('from() 메서드는', () => {
        it('FROM 절을 쿼리문에 추가해야한다', () => {
            const result = builder.from('metrics_table').build();
            expect(result.query).toContain('FROM metrics_table');
        });

        it('테이블명이 비어있으면 에러를 발생시켜야한다', () => {
            expect(() => builder.from('')).toThrow('유효한 테이블 이름을 입력해주세요.');
        });
    });

    describe('timeBetween() 메서드는', () => {
        it('시간 범위 조건을 쿼리문에 추가해야한다', () => {
            const start = new Date('2024-01-01');
            const end = new Date('2024-01-02');
            const result = builder.timeBetween(start, end).build();

            expect(result.query).toContain('WHERE timestamp >= {startTime: DateTime64(3)}');
            expect(result.query).toContain('AND timestamp < {endTime: DateTime64(3)}');
            expect(result.params).toEqual({
                startTime: start,
                endTime: end,
            });
        });

        it('시작 시간이 종료 시간보다 늦으면 에러를 발생시켜야한다', () => {
            const start = new Date('2024-01-02');
            const end = new Date('2024-01-01');

            expect(() => builder.timeBetween(start, end)).toThrow(
                '시작 시간은 종료 시간보다 이전이어야 합니다.',
            );
        });

        it('유효하지 않은 날짜가 주어지면 에러를 발생시켜야한다', () => {
            const invalidDate = new Date('invalid');
            const validDate = new Date('2024-01-01');

            expect(() => builder.timeBetween(invalidDate, validDate)).toThrow(
                '유효하지 않은 날짜 형식입니다.',
            );
        });
    });

    describe('filter() 메서드는', () => {
        it('단일 필터 조건을 쿼리문에 추가해야한다', () => {
            const result = builder.filter({ domain: 'example.com' }).build();

            expect(result.query).toContain('WHERE domain = {domain:String}');
            expect(result.params).toEqual({ domain: 'example.com' });
        });

        it('다중 필터 조건을 쿼리문에 추가해야한다', () => {
            const result = builder
                .filter({
                    domain: 'example.com',
                    status: 200,
                })
                .build();

            expect(result.query).toContain('WHERE domain = {domain:String}');
            expect(result.query).toContain('AND status = {status:Int32}');
            expect(result.params).toEqual({
                domain: 'example.com',
                status: 200,
            });
        });

        it('다양한 타입의 필터 값을 올바르게 처리해야한다', () => {
            const date = new Date('2024-01-01');
            const result = builder
                .filter({
                    domain: 'example.com',
                    status: 200,
                    score: 95.5,
                    timestamp: date,
                })
                .build();

            expect(result.query).toContain('domain = {domain:String}');
            expect(result.query).toContain('status = {status:Int32}');
            expect(result.query).toContain('score = {score:Float64}');
            expect(result.query).toContain('timestamp = {timestamp:DateTime64(3)}');
        });

        it('빈 필터 객체가 주어지면 기존 쿼리를 그대로 반환해야한다', () => {
            const baseQuery = builder.from('metrics_table').build().query;
            const result = builder.filter({}).build();
            expect(result.query).toBe(baseQuery);
        });

        it('필터 값이 null이면 기존 쿼리를 그대로 반환해야한다', () => {
            const baseQuery = builder.from('metrics_table').build().query;
            const result = builder.filter({} as Record<string, unknown>).build();
            expect(result.query).toBe(baseQuery);
        });

        it('객체나 배열이 필터 값으로 주어지면 에러를 발생시켜야한다', () => {
            expect(() =>
                builder.filter({
                    test: { nested: 'value' },
                }),
            ).toThrow(TimeSeriesQueryBuilderError);

            expect(() =>
                builder.filter({
                    test: ['array', 'value'],
                }),
            ).toThrow(TimeSeriesQueryBuilderError);
        });

        it('undefined가 필터 값으로 주어지면 에러를 발생시켜야한다', () => {
            expect(() =>
                builder.filter({
                    test: undefined,
                }),
            ).toThrow(TimeSeriesQueryBuilderError);
        });
    });

    describe('groupBy() 메서드는', () => {
        it('단일 컬럼으로 GROUP BY 절을 추가해야한다', () => {
            const result = builder.groupBy(['host']).build();
            expect(result.query).toContain('GROUP BY host');
        });

        it('다중 컬럼으로 GROUP BY 절을 추가해야한다', () => {
            const result = builder.groupBy(['host', 'domain']).build();
            expect(result.query).toContain('GROUP BY host, domain');
        });

        it('유효하지 않은 컬럼명이 포함되면 에러를 발생시켜야한다', () => {
            expect(() => builder.groupBy(['', 'domain'])).toThrow(
                '유효하지 않은 그룹화 컬럼이 포함되어 있습니다.',
            );
        });

        it('유효하지 않은 필드형식을 받으면 에러를 발생시켜야한다', () => {
            const invalidField: string[] = [''];
            expect(() => builder.groupBy(invalidField)).toThrow(
                '유효하지 않은 그룹화 컬럼이 포함되어 있습니다.',
            );
        });
    });

    describe('orderBy() 메서드는', () => {
        it('오름차순 정렬 조건을 쿼리문에 추가해야한다', () => {
            const result = builder.orderBy(['timestamp']).build();
            expect(result.query).toContain('ORDER BY timestamp');
            expect(result.query).not.toContain('DESC');
        });

        it('내림차순 정렬 조건을 쿼리문에 추가해야한다', () => {
            const result = builder.orderBy(['timestamp'], true).build();
            expect(result.query).toContain('ORDER BY timestamp DESC');
        });

        it('다중 필드 정렬 조건을 쿼리문에 추가해야한다', () => {
            const result = builder.orderBy(['domain', 'timestamp'], true).build();
            expect(result.query).toContain('ORDER BY domain, timestamp DESC');
        });

        it('정렬 필드가 비어있으면 에러를 발생시켜야한다', () => {
            expect(() => builder.orderBy([])).toThrow('정렬할 필드를 1개 이상 지정해주세요.');
        });

        it('빈 배열이 주어지면 그룹화하지 않아야한다', () => {
            const baseQuery = builder.from('metrics_table').build().query;
            const result = builder.groupBy([]).build();
            expect(result.query).toBe(baseQuery);
        });

        it('null이나 undefined가 주어지면 그룹화하지 않아야한다', () => {
            const baseQuery = builder.from('metrics_table').build().query;

            const resultWithNull = builder.groupBy(null as unknown as string[]).build();
            expect(resultWithNull.query).toBe(baseQuery);

            const resultWithUndefined = builder.groupBy(undefined as unknown as string[]).build();
            expect(resultWithUndefined.query).toBe(baseQuery);
        });

        it('유효하지 않은 필드형식을 받으면 에러를 발생시켜야한다', () => {
            const invalidField: string[] = [''];
            expect(() => builder.orderBy(invalidField)).toThrow(
                '유효하지 않은 필드명이 포함되어 있습니다.',
            );
        });
    });

    describe('limit() 메서드는', () => {
        it('LIMIT 절을 쿼리문에 추가해야한다', () => {
            const result = builder.limit(10).build();
            expect(result.query).toContain('LIMIT 10');
        });

        it('음수가 주어지면 에러를 발생시켜야한다', () => {
            expect(() => builder.limit(-1)).toThrow('limit 값은 0 이상이어야 합니다.');
        });

        it('실수가 주어지면 에러를 발생시켜야한다', () => {
            expect(() => builder.limit(10.5)).toThrow('limit 값은 정수여야 합니다.');
        });
    });

    describe('build() 메서드는', () => {
        it('모든 조건이 포함된 완성된 쿼리문을 생성해야한다', () => {
            const start = new Date('2024-01-01');
            const end = new Date('2024-01-02');

            const result = builder
                .interval('1 MINUTE')
                .metrics([{ name: 'cpu_usage', aggregation: 'avg' }])
                .from('metrics_table')
                .timeBetween(start, end)
                .filter({ domain: 'example.com' })
                .groupBy(['host'])
                .orderBy(['timestamp'], true)
                .limit(10)
                .build();

            expect(result.query).toContain('SELECT');
            expect(result.query).toContain('toStartOf1 MINUTE(timestamp) as timestamp');
            expect(result.query).toContain('avg(cpu_usage)');
            expect(result.query).toContain('FROM metrics_table');
            expect(result.query).toContain('WHERE timestamp >= {startTime: DateTime64(3)}');
            expect(result.query).toContain('AND timestamp < {endTime: DateTime64(3)}');
            expect(result.query).toContain('AND domain = {domain:String}');
            expect(result.query).toContain('GROUP BY host');
            expect(result.query).toContain('ORDER BY timestamp DESC');
            expect(result.query).toContain('LIMIT 10');

            expect(result.params).toEqual({
                startTime: start,
                endTime: end,
                domain: 'example.com',
            });
        });

        it('개발 환경에서는 쿼리를 로깅해야한다', () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'development';

            builder.from('metrics_table').build();
            expect(consoleSpy).toHaveBeenCalled();

            process.env.NODE_ENV = originalEnv;
        });
    });
});
