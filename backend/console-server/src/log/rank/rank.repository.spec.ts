import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { RankRepository } from './rank.repository';
import { Clickhouse } from '../../clickhouse/clickhouse';
import { TimeSeriesQueryBuilder } from '../../clickhouse/query-builder/time-series.query-builder';

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

            it('조회 결과는 HostErrorRateMetric 객체 타입을 가져야한다', async () => {
                mockClickhouse.query.mockResolvedValue(mockResults);

                const results = await repository.findSuccessRateOrderByCount();

                expect(results).toHaveLength(mockResults.length);
                results.forEach((result, index) => {
                    expect(typeof result.host).toBe('string');
                    expect(typeof result.is_error_rate).toBe('number');
                    expect(result.host).toBe(mockResults[index].host);
                    expect(result.is_error_rate).toBe(mockResults[index].is_error_rate);
                });
            });

            it('Clickhouse 쿼리 실패 시 에러를 전파해야 한다', async () => {
                const error = new Error('Clickhouse query failed');
                mockClickhouse.query.mockRejectedValue(error);

                await expect(repository.findSuccessRateOrderByCount()).rejects.toThrow(error);
            });
        });

        describe('findCountOrderByCount()는', () => {
            const mockQueryResult = {
                query: 'SELECT host, count() as count FROM http_log GROUP BY host ORDER BY count',
                params: {},
            };

            const mockResults = [
                { host: 'test1.com', count: 9999 },
                { host: 'test2.com', count: 9898 },
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

                await repository.findCountOrderByCount();

                expect(TimeSeriesQueryBuilder).toHaveBeenCalled();
            });

            it('생성된 쿼리로 Clickhouse를 호출해야 한다', async () => {
                mockClickhouse.query.mockResolvedValue(mockResults);

                await repository.findCountOrderByCount();

                expect(clickhouse.query).toHaveBeenCalledWith(
                    mockQueryResult.query,
                    mockQueryResult.params,
                );
            });

            it('조회 결과는 HostCountMetric 객체 타입을 가져야한다', async () => {
                mockClickhouse.query.mockResolvedValue(mockResults);

                const results = await repository.findCountOrderByCount();

                expect(results).toHaveLength(mockResults.length);
                results.forEach((result, index) => {
                    expect(typeof result.host).toBe('string');
                    expect(typeof result.count).toBe('number');
                    expect(result.host).toBe(mockResults[index].host);
                    expect(result.count).toBe(mockResults[index].count);
                });
            });

            it('Clickhouse 쿼리 실패 시 에러를 전파해야 한다', async () => {
                const error = new Error('Clickhouse query failed');
                mockClickhouse.query.mockRejectedValue(error);

                await expect(repository.findCountOrderByCount()).rejects.toThrow(error);
            });
        });
    });
});
