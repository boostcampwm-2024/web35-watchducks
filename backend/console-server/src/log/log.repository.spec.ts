import { Test } from '@nestjs/testing';
import { LogRepository } from './log.repository';
import { Clickhouse } from '../clickhouse/clickhouse';
import type { TestingModule } from '@nestjs/testing';

describe('LogRepository 테스트', () => {
    let repository: LogRepository;
    let clickhouse: Clickhouse;

    const mockClickhouse = {
        query: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LogRepository,
                {
                    provide: Clickhouse,
                    useValue: mockClickhouse,
                },
            ],
        }).compile();

        repository = module.get<LogRepository>(LogRepository);
        clickhouse = module.get<Clickhouse>(Clickhouse);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('레퍼지토리가 정의될 수 있어야 한다.', () => {
        expect(repository).toBeDefined();
    });

    describe('findHttpLog()는 ', () => {
        it('요구 받은 조건의 트래픽 정보를 반환한다.', async () => {
            const mockResult = [
                {
                    date: '2024-11-18',
                    avg_elapsed_time: 100,
                    request_count: 1000,
                },
            ];
            mockClickhouse.query.mockResolvedValue(mockResult);

            const result = await repository.findHttpLog();

            expect(result).toEqual(mockResult);
            expect(clickhouse.query).toHaveBeenCalledWith(
                expect.stringMatching(
                    /SELECT.*toDate\(timestamp\).*FROM http_log.*GROUP BY date.*ORDER BY date/s,
                ),
            );
        });

        it('결과가 없을 경우 빈 배열을 반환해야 한다.', async () => {
            mockClickhouse.query.mockResolvedValue([]);

            const result = await repository.findHttpLog();

            expect(result).toEqual([]);
        });

        it('clickhouse 에러 발생시 예외를 throw 해야 한다.', async () => {
            const error = new Error('Clickhouse connection error');
            mockClickhouse.query.mockRejectedValue(error);

            await expect(repository.findHttpLog()).rejects.toThrow('Clickhouse connection error');
        });
    });

    describe('findAvgElapsedTime()는 ', () => {
        it('TimeSeriesQueryBuilder를 사용하여 올바른 쿼리를 생성해야 한다.', async () => {
            const mockResult = [{ avg_elapsed_time: 150 }];
            mockClickhouse.query.mockResolvedValue(mockResult);

            const result = await repository.findAvgElapsedTime();

            expect(result).toEqual(mockResult[0]);
            expect(clickhouse.query).toHaveBeenCalledWith(
                expect.stringMatching(/SELECT.*avg\(elapsed_time\)/),
                expect.any(Object),
            );
        });
    });

    describe('findCountByHost()는 ', () => {
        it('호스트별 요청 수를 내림차순으로 정렬하여 반환해야 한다.', async () => {
            const mockResult = [
                { host: 'api.example.com', count: 1000 },
                { host: 'web.example.com', count: 500 },
            ];
            mockClickhouse.query.mockResolvedValue(mockResult);

            const result = await repository.findCountByHost();

            expect(result).toEqual(mockResult);
            expect(clickhouse.query).toHaveBeenCalledWith(
                expect.stringMatching(/GROUP BY.*host.*ORDER BY.*DESC/),
                expect.any(Object),
            );
        });
    });

    describe('findResponseSuccessRate()는 ', () => {
        it('성공률을 올바르게 계산할 수 있어야 한다.', async () => {
            const mockQueryResult = [{ is_error_rate: 1.5 }];
            mockClickhouse.query.mockResolvedValue(mockQueryResult);

            const result = await repository.findResponseSuccessRate();

            expect(result).toEqual({ success_rate: 98.5 });
            expect(clickhouse.query).toHaveBeenCalledWith(
                expect.stringMatching(/SELECT.*sum\(is_error\).*count\(\*\).*as is_error_rate/s),
                expect.any(Object),
            );
        });

        it('에러율이 0%일 때 성공률 100%를 반환해야 한다.', async () => {
            mockClickhouse.query.mockResolvedValue([{ is_error_rate: 0 }]);

            const result = await repository.findResponseSuccessRate();

            expect(result).toEqual({ success_rate: 100 });
        });
    });

    describe('findTrafficByGeneration()는 ', () => {
        it('전체 트래픽 수를 반환해야 한다.', async () => {
            const mockResult = [{ count: 5000 }];
            mockClickhouse.query.mockResolvedValue(mockResult);

            const result = await repository.findTrafficByGeneration();

            expect(result).toEqual(mockResult[0]);
            expect(clickhouse.query).toHaveBeenCalledWith(
                expect.stringMatching(/SELECT.*count\(\).*as count/s),
                expect.any(Object),
            );
        });
    });

    describe('getPathSpeedRankByProject()는 ', () => {
        const domain = 'example.com';
        const mockFastestPaths = [
            { path: '/api/v1/resource', avg_elapsed_time: 123.45 },
            { path: '/api/v1/users', avg_elapsed_time: 145.67 },
            { path: '/api/v1/orders', avg_elapsed_time: 150.89 },
        ];
        const mockSlowestPaths = [
            { path: '/api/v1/reports', avg_elapsed_time: 345.67 },
            { path: '/api/v1/logs', avg_elapsed_time: 400.23 },
            { path: '/api/v1/stats', avg_elapsed_time: 450.56 },
        ];

        it('도메인을 기준으로 Top 3 fastest 경로와 slowest 경로를 반환해야 한다.', async () => {
            mockClickhouse.query
                .mockResolvedValueOnce(mockFastestPaths)
                .mockResolvedValueOnce(mockSlowestPaths);

            const result = await repository.getPathSpeedRankByProject(domain);

            expect(result).toEqual({
                fastestPaths: mockFastestPaths,
                slowestPaths: mockSlowestPaths,
            });

            expect(clickhouse.query).toHaveBeenCalledTimes(2);
            expect(clickhouse.query).toHaveBeenNthCalledWith(
                1,
                expect.stringMatching(
                    /SELECT\s+avg\(elapsed_time\) as avg_elapsed_time,\s+path\s+FROM http_log\s+WHERE host = \{host:String}\s+GROUP BY path\s+ORDER BY avg_elapsed_time\s+LIMIT 3/,
                ),
                expect.objectContaining({ host: domain }),
            );
            expect(clickhouse.query).toHaveBeenNthCalledWith(
                2,
                expect.stringMatching(
                    /SELECT\s+avg\(elapsed_time\) as avg_elapsed_time,\s+path\s+FROM http_log\s+WHERE host = \{host:String}\s+GROUP BY path\s+ORDER BY avg_elapsed_time DESC\s+LIMIT 3/,
                ),
                expect.objectContaining({ host: domain }),
            );
        });

        it('클릭하우스 에러 발생 시 예외를 throw 해야 한다.', async () => {
            const error = new Error('Clickhouse query failed');
            mockClickhouse.query.mockRejectedValue(error);

            await expect(repository.getPathSpeedRankByProject(domain)).rejects.toThrow(
                'Clickhouse query failed',
            );
        });
    });

    describe('getTrafficByProject()는', () => {
        const domain = 'example.com';
        const timeUnit = 'Hour';

        const mockTrafficData = [
            { timestamp: '2024-11-18 10:00:00', count: 150 },
            { timestamp: '2024-11-18 11:00:00', count: 120 },
            { timestamp: '2024-11-18 12:00:00', count: 180 },
        ];

        it('올바른 도메인과 시간 단위를 기준으로 트래픽 데이터를 반환해야 한다.', async () => {
            mockClickhouse.query.mockResolvedValue(mockTrafficData);

            const result = await repository.getTrafficByProject(domain, timeUnit);

            expect(result).toEqual(mockTrafficData);
            expect(clickhouse.query).toHaveBeenCalledWith(
                expect.stringMatching(
                    /SELECT\s+count\(\)\s+as\s+count,\s+toStartOfHour\(timestamp\)\s+as\s+timestamp\s+FROM\s+http_log\s+WHERE\s+host\s+=\s+\{host:String}\s+GROUP\s+BY\s+timestamp\s+ORDER\s+BY\s+timestamp/s,
                ),
                expect.objectContaining({ host: domain }),
            );
        });

        it('트래픽 데이터가 없을 경우 빈 배열을 반환해야 한다.', async () => {
            mockClickhouse.query.mockResolvedValue([]);

            const result = await repository.getTrafficByProject(domain, timeUnit);

            expect(result).toEqual([]);
            expect(clickhouse.query).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ host: domain }),
            );
        });

        it('Clickhouse 호출 중 에러가 발생하면 예외를 throw 해야 한다.', async () => {
            const error = new Error('Clickhouse query failed');
            mockClickhouse.query.mockRejectedValue(error);

            await expect(repository.getTrafficByProject(domain, timeUnit)).rejects.toThrow(
                'Clickhouse query failed',
            );

            expect(clickhouse.query).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ host: domain }),
            );
        });
    });
});
