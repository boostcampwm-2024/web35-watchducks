import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { RankRepository } from './rank.repository';
import { Clickhouse } from '../../clickhouse/clickhouse';
import { TimeSeriesQueryBuilder } from '../../clickhouse/query-builder/time-series.query-builder';
import { HostErrorRateMetric } from './metric/host-error-rate.metric';

jest.mock('../../clickhouse/query-builder/time-series.query-builder');

describe('RankRepository', () => {
    let repository: RankRepository;
    let clickhouse: Clickhouse;

    const mockClickhouse = {
        query: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RankRepository,
                {
                    provide: Clickhouse,
                    useValue: mockClickhouse,
                },
            ],
        }).compile();

        repository = module.get<RankRepository>(RankRepository);
        clickhouse = module.get<Clickhouse>(Clickhouse);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('RankRepository의', () => {
        describe('findSuccessRateOrderByCount()는', () => {
            const mockQueryResult = {
                query: 'SELECT host, is_error FROM http_log GROUP BY host ORDER BY is_error_rate',
                params: {},
            };

            const mockResults = [
                { host: 'test1.com', is_error_rate: 10 },
                { host: 'test2.com', is_error_rate: 20 },
            ];

            beforeEach(() => {
                (TimeSeriesQueryBuilder as jest.Mock).mockImplementation(() => ({
                    metrics: jest.fn().mockReturnThis(),
                    from: jest.fn().mockReturnThis(),
                    groupBy: jest.fn().mockReturnThis(),
                    orderBy: jest.fn().mockReturnThis(),
                    build: jest.fn().mockReturnValue(mockQueryResult),
                }));
            });

            it('TimeSeriesQueryBuilder를 사용하여 쿼리를 생성해야 한다', async () => {
                mockClickhouse.query.mockResolvedValue(mockResults);

                await repository.findSuccessRateOrderByCount();

                expect(TimeSeriesQueryBuilder).toHaveBeenCalled();
            });

            it('생성된 쿼리로 Clickhouse를 호출해야 한다', async () => {
                mockClickhouse.query.mockResolvedValue(mockResults);

                await repository.findSuccessRateOrderByCount();

                expect(clickhouse.query).toHaveBeenCalledWith(
                    mockQueryResult.query,
                    mockQueryResult.params,
                );
            });

            it('조회 결과를 HostErrorRateMetric 인스턴스로 변환하여 반환해야 한다', async () => {
                mockClickhouse.query.mockResolvedValue(mockResults);

                const result = await repository.findSuccessRateOrderByCount();

                expect(result).toHaveLength(mockResults.length);
                result.forEach((item, index) => {
                    expect(item).toBeInstanceOf(HostErrorRateMetric);
                    expect(item.host).toBe(mockResults[index].host);
                    expect(item.is_error_rate).toBe(mockResults[index].is_error_rate);
                });
            });

            it('Clickhouse 쿼리 실패 시 에러를 전파해야 한다', async () => {
                const error = new Error('Clickhouse query failed');
                mockClickhouse.query.mockRejectedValue(error);

                await expect(repository.findSuccessRateOrderByCount()).rejects.toThrow(error);
            });
        });
    });

    describe('findDAUOrderByCount()는', () => {
        const testDate = '2024-11-25';
        const mockQueryResult = {
            query: 'SELECT domain as host, SUM(access) as dau FROM dau WHERE date = {date} GROUP BY domain ORDER BY dau DESC',
            params: { date: testDate },
        };

        const mockResults = [
            { host: 'test1.com', dau: 1000 },
            { host: 'test2.com', dau: 500 },
        ];

        beforeEach(() => {
            (TimeSeriesQueryBuilder as jest.Mock).mockImplementation(() => ({
                metrics: jest.fn().mockReturnThis(),
                from: jest.fn().mockReturnThis(),
                filter: jest.fn().mockReturnThis(),
                groupBy: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                build: jest.fn().mockReturnValue(mockQueryResult),
            }));
        });

        it('TimeSeriesQueryBuilder를 사용하여 쿼리를 생성해야 한다', async () => {
            mockClickhouse.query.mockResolvedValue(mockResults);

            await repository.findCountOrderByDAU(testDate);

            expect(TimeSeriesQueryBuilder).toHaveBeenCalled();
            const queryBuilder = (TimeSeriesQueryBuilder as jest.Mock).mock.results[0].value;

            expect(queryBuilder.metrics).toHaveBeenCalledWith([
                { name: 'domain as host' },
                { name: 'SUM(access) as dau' },
            ]);
            expect(queryBuilder.from).toHaveBeenCalledWith('dau');
            expect(queryBuilder.filter).toHaveBeenCalledWith({ date: testDate });
            expect(queryBuilder.groupBy).toHaveBeenCalledWith(['domain']);
            expect(queryBuilder.orderBy).toHaveBeenCalledWith(['dau'], true);
        });

        it('생성된 쿼리로 Clickhouse를 호출해야 한다', async () => {
            mockClickhouse.query.mockResolvedValue(mockResults);

            await repository.findCountOrderByDAU(testDate);

            expect(clickhouse.query).toHaveBeenCalledWith(
                mockQueryResult.query,
                mockQueryResult.params,
            );
        });

        it('조회 결과는 host와 dau 속성을 가진 객체여야 한다', async () => {
            mockClickhouse.query.mockResolvedValue(mockResults);

            const results = await repository.findCountOrderByDAU(testDate);

            expect(results).toHaveLength(mockResults.length);
            results.forEach((result) => {
                expect(typeof result.host).toBe('string');
                expect(typeof result.dau).toBe('number');
            });
        });

        it('Clickhouse 쿼리 실패 시 에러를 전파해야 한다', async () => {
            const error = new Error('Clickhouse query failed');
            mockClickhouse.query.mockRejectedValue(error);

            await expect(repository.findCountOrderByDAU(testDate)).rejects.toThrow(error);
        });
    });
});
