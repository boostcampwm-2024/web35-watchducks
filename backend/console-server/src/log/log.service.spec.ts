import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { LogService } from './log.service';
import { LogRepository } from './log.repository';

describe('LogService 테스트', () => {
    let service: LogService;
    let repository: LogRepository;

    const mockLogRepository = {
        findHttpLog: jest.fn(),
        findAvgElapsedTime: jest.fn(),
        findCountByHost: jest.fn(),
        findResponseSuccessRate: jest.fn(),
        findTrafficByGeneration: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LogService,
                {
                    provide: LogRepository,
                    useValue: mockLogRepository,
                },
            ],
        }).compile();

        service = module.get<LogService>(LogService);
        repository = module.get<LogRepository>(LogRepository);

        jest.clearAllMocks();
    });

    it('서비스가 정의될 수 있어야 한다.', () => {
        expect(service).toBeDefined();
    });

    describe('httpLog()는 ', () => {
        it('레포지토리에서 로그를 올바르게 반환할 수 있어야 있다.', async () => {
            const mockLogs = [{ date: '2024-03-01', avg_elapsed_time: 100, request_count: 1000 }];
            mockLogRepository.findHttpLog.mockResolvedValue(mockLogs);

            const result = await service.httpLog();

            expect(result).toEqual(mockLogs);
            expect(repository.findHttpLog).toHaveBeenCalled();
        });

        it('빈 결과를 잘 처리할 수 있어야 한다.', async () => {
            mockLogRepository.findHttpLog.mockResolvedValue([]);

            const result = await service.httpLog();

            expect(result).toEqual([]);
        });

        it('레포지토리 에러를 처리할 수 있어야 한다.', async () => {
            mockLogRepository.findHttpLog.mockRejectedValue(new Error('Database error'));

            await expect(service.httpLog()).rejects.toThrow('Database error');
        });
    });

    describe('elapsedTime()는 ', () => {
        it('평균 응답 시간을 반환할 수 있어야 한다.', async () => {
            const mockTime = { avg_elapsed_time: 150 };
            mockLogRepository.findAvgElapsedTime.mockResolvedValue(mockTime);

            const result = await service.elapsedTime();

            expect(result).toEqual(mockTime);
            expect(repository.findAvgElapsedTime).toHaveBeenCalled();
        });
    });

    describe('trafficRank()는 ', () => {
        it('top 5 traffic ranks를 리턴할 수 있어야 한다.', async () => {
            const mockRanks = [
                { host: 'api1.example.com', count: 1000 },
                { host: 'api2.example.com', count: 800 },
                { host: 'api3.example.com', count: 600 },
                { host: 'api4.example.com', count: 400 },
                { host: 'api5.example.com', count: 200 },
                { host: 'api6.example.com', count: 110 },
            ];
            mockLogRepository.findCountByHost.mockResolvedValue(mockRanks);

            const result = await service.trafficRank();

            expect(result).toHaveLength(5);
            expect(result).toEqual(mockRanks.slice(0, 5));
            expect(repository.findCountByHost).toHaveBeenCalled();
        });

        it('5개 이하의 결과에 대해서 올바르게 처리할 수 있어야 한다.', async () => {
            const mockRanks = [
                { host: 'api1.example.com', count: 1000 },
                { host: 'api2.example.com', count: 800 },
            ];
            mockLogRepository.findCountByHost.mockResolvedValue(mockRanks);

            const result = await service.trafficRank();

            expect(result).toHaveLength(2);
            expect(result).toEqual(mockRanks);
        });
    });

    describe('responseSuccessRate()는 ', () => {
        it('응답 성공률을 반환할 수 있어야 한다.', async () => {
            const mockRate = { success_rate: 98.5 };
            mockLogRepository.findResponseSuccessRate.mockResolvedValue(mockRate);

            const result = await service.responseSuccessRate();

            expect(result).toEqual(mockRate);
            expect(repository.findResponseSuccessRate).toHaveBeenCalled();
        });
    });

    describe('trafficByGeneration()는 ', () => {
        it('기수별 트래픽을 올바르게 반환할 수 있어야 한다.', async () => {
            const mockStats = [
                { generation: '10s', count: 500 },
                { generation: '20s', count: 300 },
                { generation: '30s', count: 200 },
            ];
            mockLogRepository.findTrafficByGeneration.mockResolvedValue(mockStats);

            const result = await service.trafficByGeneration();

            expect(result).toEqual(mockStats);
            expect(repository.findTrafficByGeneration).toHaveBeenCalled();
        });
    });
});
