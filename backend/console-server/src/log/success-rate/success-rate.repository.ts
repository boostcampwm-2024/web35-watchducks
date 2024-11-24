import { Clickhouse } from '../../clickhouse/clickhouse';
import { TimeSeriesQueryBuilder } from '../../clickhouse/query-builder/time-series.query-builder';
import type { ErrorRateMetric } from './metric/error-rate.metric';
import { plainToInstance } from 'class-transformer';
import { SuccessRateMetric } from './metric/success-rate.metric';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SuccessRateRepository {
    constructor(@Inject(Clickhouse) private readonly clickhouse: Clickhouse) {}

    async findSuccessRate() {
        const { query } = new TimeSeriesQueryBuilder()
            .metrics([
                {
                    name: 'is_error',
                    aggregation: 'rate',
                },
            ])
            .from('http_log')
            .build();

        const [result] = await this.clickhouse.query<ErrorRateMetric>(query);

        return plainToInstance(SuccessRateMetric, {
            success_rate: 100 - result.is_error_rate,
        });
    }

    async findSuccessRateByProject(domain: string) {
        const subQueryBuilder = new TimeSeriesQueryBuilder()
            .metrics([{ name: 'is_error' }, { name: 'timestamp' }])
            .from('http_log')
            .filter({ host: domain })
            .orderBy(['timestamp'], true)
            .limit(1000)
            .build();

        const mainQueryBuilder = new TimeSeriesQueryBuilder()
            .metrics([
                {
                    name: 'is_error',
                    aggregation: 'rate',
                },
            ])
            .from(`(${subQueryBuilder.query}) as subquery`)
            .build();

        const [result] = await this.clickhouse.query<ErrorRateMetric>(
            mainQueryBuilder.query,
            subQueryBuilder.params,
        );

        return plainToInstance(SuccessRateMetric, {
            success_rate: 100 - result.is_error_rate,
        });
    }
}
