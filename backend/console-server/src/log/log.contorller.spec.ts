import { Test } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { LogController } from './log.controller';
import { LogService } from './log.service';

interface TrafficRankResponseType {
    status: number;
    data: Array<{ host: string; count: number }>;
}

describe('LogController 테스트', () => {
    let controller: LogController;
    let service: LogService;

    const mockLogService = {
        httpLog: jest.fn(),
        elapsedTime: jest.fn(),
        trafficRank: jest.fn(),
        responseSuccessRate: jest.fn(),
        trafficByGeneration: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LogController],
            providers: [
                {
                    provide: LogService,
                    useValue: mockLogService,
                },
            ],
        }).compile();

        controller = module.get<LogController>(LogController);
        service = module.get<LogService>(LogService);

        jest.clearAllMocks();
    });

    it('컨트롤러가 정의되어 있어야 한다', () => {
        expect(controller).toBeDefined();
    });

    describe('httpLog는 ', () => {
        const mockResult = [
            {
                date: '2024-11-18',
                avg_elapsed_time: 100,
                request_count: 1000,
            },
        ];

        it('HTTP 로그 데이터를 반환해야 한다', async () => {
            mockLogService.httpLog.mockResolvedValue(mockResult);

            const result = await controller.httpLog();

            expect(result).toEqual(mockResult);
            expect(service.httpLog).toHaveBeenCalledTimes(1);
        });

        it('서비스 에러 시 예외를 throw 해야 한다', async () => {
            const error = new Error('Database error');
            mockLogService.httpLog.mockRejectedValue(error);

            await expect(controller.httpLog()).rejects.toThrow(error);
        });
    });

    describe('elapsedTime()은 ', () => {
        const mockResult = {
            status: HttpStatus.OK,
            data: { avg_elapsed_time: 150 },
        };

        it('평균 응답 시간을 ProjectResponseDto 형식으로 반환해야 한다', async () => {
            mockLogService.elapsedTime.mockResolvedValue(mockResult);

            const result = await controller.elapsedTime();

            expect(result).toEqual(mockResult);
            expect(result).toHaveProperty('status', HttpStatus.OK);
            expect(result).toHaveProperty('data.avg_elapsed_time');
            expect(service.elapsedTime).toHaveBeenCalledTimes(1);
        });
    });

    describe('trafficRank()는 ', () => {
        const mockResult: TrafficRankResponseType = {
            status: HttpStatus.OK,
            data: [
                { host: 'api1.example.com', count: 1000 },
                { host: 'api2.example.com', count: 800 },
                { host: 'api3.example.com', count: 600 },
                { host: 'api4.example.com', count: 400 },
                { host: 'api5.example.com', count: 200 },
            ],
        };

        it('TOP 5 트래픽 순위를 ProjectResponseDto 형식으로 반환해야 한다', async () => {
            mockLogService.trafficRank.mockResolvedValue(mockResult);

            const result = (await controller.trafficRank()) as unknown as TrafficRankResponseType;

            expect(result).toEqual(mockResult);
            expect(result).toHaveProperty('status', HttpStatus.OK);
            expect(result.data).toHaveLength(5);
            expect(service.trafficRank).toHaveBeenCalledTimes(1);

            const sortedData = [...result.data].sort((a, b) => b.count - a.count);
            expect(result.data).toEqual(sortedData);
        });
    });

    describe('responseSuccessRate()는 ', () => {
        const mockResult = {
            status: HttpStatus.OK,
            data: { success_rate: 98.5 },
        };

        it('응답 성공률을 ProjectResponseDto 형식으로 반환해야 한다', async () => {
            mockLogService.responseSuccessRate.mockResolvedValue(mockResult);

            const result = await controller.responseSuccessRate();

            expect(result).toEqual(mockResult);
            expect(result).toHaveProperty('status', HttpStatus.OK);
            expect(result).toHaveProperty('data.success_rate');
            expect(service.responseSuccessRate).toHaveBeenCalledTimes(1);
        });
    });

    describe('trafficByGeneration()는 ', () => {
        const mockResult = {
            status: HttpStatus.OK,
            data: { total_traffic: 15000 },
        };

        it('기수별 총 트래픽을 ProjectResponseDto 형식으로 반환해야 한다', async () => {
            mockLogService.trafficByGeneration.mockResolvedValue(mockResult);

            const result = await controller.trafficByGeneration();

            expect(result).toEqual(mockResult);
            expect(result).toHaveProperty('status', HttpStatus.OK);
            expect(result).toHaveProperty('data.total_traffic');
            expect(service.trafficByGeneration).toHaveBeenCalledTimes(1);
        });
    });
});