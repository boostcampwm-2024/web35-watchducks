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
        getResponseSuccessRate: jest.fn(),
        getResponseSuccessRateByProject: jest.fn(),
        getTrafficByGeneration: jest.fn(),
        getPathSpeedRankByProject: jest.fn(),
        getTrafficByProject: jest.fn(),
        getTrafficDailyDifferenceByGeneration: jest.fn(),
        getDAUByProject: jest.fn(),
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
            expect(service.getAvgElapsedTime).toHaveBeenCalledTimes(1);
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
            expect(service.getTrafficRank).toHaveBeenCalledTimes(1);

            const sortedData = [...result.data].sort((a, b) => b.count - a.count);
            expect(result.data).toEqual(sortedData);
        });
    });

    describe('getResponseSuccessRate()는 ', () => {
        const mockSuccessRateDto = { generation: 5 };
        const mockServiceResponse = { success_rate: 98.5 };

        it('응답 성공률을 반환해야 한다', async () => {
            mockLogService.getResponseSuccessRate.mockResolvedValue(mockServiceResponse);

            const result = await controller.getResponseSuccessRate(mockSuccessRateDto);

            expect(result).toEqual({ success_rate: 98.5 });
            expect(service.getResponseSuccessRate).toHaveBeenCalledWith(mockSuccessRateDto);
            expect(service.getResponseSuccessRate).toHaveBeenCalledTimes(1);
        });
    });

    describe('getResponseSuccessRateByProject()는 ', () => {
        const mockRequestDto = { projectName: 'example-project' };
        const mockServiceResponse = {
            projectName: 'example-project',
            success_rate: 95.5,
        };

        it('해당 프로젝트의 응답 성공률을 반환해야 한다', async () => {
            mockLogService.getResponseSuccessRateByProject.mockResolvedValue(mockServiceResponse);

            const result = await controller.getResponseSuccessRateByProject(mockRequestDto);

            expect(result).toEqual(mockServiceResponse);
            expect(result).toHaveProperty('projectName', 'example-project');
            expect(result).toHaveProperty('success_rate', 95.5);
            expect(service.getResponseSuccessRateByProject).toHaveBeenCalledWith(mockRequestDto);
            expect(service.getResponseSuccessRateByProject).toHaveBeenCalledTimes(1);
        });

        it('서비스 호출 시, 에러가 발생하면 예외를 throw 해야 한다', async () => {
            const error = new Error('Database error');
            mockLogService.getResponseSuccessRateByProject.mockRejectedValue(error);

            await expect(
                controller.getResponseSuccessRateByProject(mockRequestDto),
            ).rejects.toThrow(error);

            expect(service.getResponseSuccessRateByProject).toHaveBeenCalledWith(mockRequestDto);
            expect(service.getResponseSuccessRateByProject).toHaveBeenCalledTimes(1);
        });

        it('성공률이 100%인 경우에도 정상적으로 반환해야 한다', async () => {
            const perfectRateResponse = {
                projectName: 'example-project',
                success_rate: 100,
            };
            mockLogService.getResponseSuccessRateByProject.mockResolvedValue(perfectRateResponse);

            const result = await controller.getResponseSuccessRateByProject(mockRequestDto);

            expect(result).toEqual(perfectRateResponse);
            expect(result.success_rate).toBe(100);
            expect(service.getResponseSuccessRateByProject).toHaveBeenCalledWith(mockRequestDto);
            expect(service.getResponseSuccessRateByProject).toHaveBeenCalledTimes(1);
        });
    });

    describe('trafficByGeneration()는 ', () => {
        it('기수별 트래픽 총량을 올바르게 반환해야 한다', async () => {
            const mockTrafficByGenerationDto = { generation: 9 };
            const mockResponse = { count: 1000 };

            mockLogService.getTrafficByGeneration.mockResolvedValue(mockResponse);

            const result = await controller.getTrafficByGeneration(mockTrafficByGenerationDto);

            expect(result).toEqual(mockResponse);
            expect(result).toHaveProperty('count', 1000);
            expect(service.getTrafficByGeneration).toHaveBeenCalledWith(mockTrafficByGenerationDto);
            expect(service.getTrafficByGeneration).toHaveBeenCalledTimes(1);
        });
    });

    describe('getPathSpeedRankByProject()는 ', () => {
        const mockRequestDto = {
            projectName: 'example-project',
        };

        const mockResponseDto = {
            projectName: 'example-project',
            fastestPaths: [
                { path: '/api/v1/resource', avg_elapsed_time: 123.45 },
                { path: '/api/v1/users', avg_elapsed_time: 145.67 },
                { path: '/api/v1/orders', avg_elapsed_time: 150.89 },
            ],
            slowestPaths: [
                { path: '/api/v1/reports', avg_elapsed_time: 345.67 },
                { path: '/api/v1/logs', avg_elapsed_time: 400.23 },
                { path: '/api/v1/stats', avg_elapsed_time: 450.56 },
            ],
        };

        it('프로젝트의 경로별 응답 속도 순위를 반환해야 한다', async () => {
            mockLogService.getPathSpeedRankByProject.mockResolvedValue(mockResponseDto);

            const result = await controller.getPathSpeedRankByProject(mockRequestDto);

            expect(result).toEqual(mockResponseDto);
            expect(service.getPathSpeedRankByProject).toHaveBeenCalledWith(mockRequestDto);
            expect(service.getPathSpeedRankByProject).toHaveBeenCalledTimes(1);

            expect(result).toHaveProperty('projectName', mockRequestDto.projectName);
            expect(result.fastestPaths).toHaveLength(3);
            expect(result.slowestPaths).toHaveLength(3);
        });

        it('서비스 에러 시 예외를 throw 해야 한다', async () => {
            const error = new Error('Database error');
            mockLogService.getPathSpeedRankByProject.mockRejectedValue(error);

            await expect(controller.getPathSpeedRankByProject(mockRequestDto)).rejects.toThrow(
                error,
            );

            expect(service.getPathSpeedRankByProject).toHaveBeenCalledWith(mockRequestDto);
            expect(service.getPathSpeedRankByProject).toHaveBeenCalledTimes(1);
        });
    });

    describe('getTrafficByProject()는', () => {
        const mockRequestDto = { projectName: 'example-project', timeUnit: 'month' };
        const mockResponseDto = {
            projectName: 'example-project',
            timeUnit: 'month',
            trafficData: [
                { timestamp: '2024-11-01', count: 14 },
                { timestamp: '2024-10-01', count: 10 },
            ],
        };
        it('프로젝트의 시간 단위별 트래픽 데이터를 반환해야 한다', async () => {
            mockLogService.getTrafficByProject.mockResolvedValue(mockResponseDto);

            const result = await controller.getTrafficByProject(mockRequestDto);

            expect(result).toEqual(mockResponseDto);
            expect(result).toHaveProperty('projectName', mockRequestDto.projectName);
            expect(result).toHaveProperty('timeUnit', mockRequestDto.timeUnit);
            expect(result.trafficData).toHaveLength(2);
            expect(result.trafficData[0]).toHaveProperty('timestamp', '2024-11-01');
            expect(result.trafficData[0]).toHaveProperty('count', 14);
            expect(service.getTrafficByProject).toHaveBeenCalledWith(mockRequestDto);
            expect(service.getTrafficByProject).toHaveBeenCalledTimes(1);
        });

        it('서비스 에러 시 예외를 throw 해야 한다', async () => {
            const error = new Error('Database error');
            mockLogService.getTrafficByProject.mockRejectedValue(error);

            await expect(controller.getTrafficByProject(mockRequestDto)).rejects.toThrow(error);

            expect(service.getTrafficByProject).toHaveBeenCalledWith(mockRequestDto);
            expect(service.getTrafficByProject).toHaveBeenCalledTimes(1);
        });

        it('빈 트래픽 데이터를 반환해야 한다 (No Data)', async () => {
            const emptyResponseDto = {
                projectName: 'example-project',
                timeUnit: 'month',
                trafficData: [],
            };
            mockLogService.getTrafficByProject.mockResolvedValue(emptyResponseDto);

            const result = await controller.getTrafficByProject(mockRequestDto);

            expect(result).toEqual(emptyResponseDto);
            expect(result).toHaveProperty('projectName', mockRequestDto.projectName);
            expect(result).toHaveProperty('timeUnit', mockRequestDto.timeUnit);
            expect(result.trafficData).toHaveLength(0);
            expect(service.getTrafficByProject).toHaveBeenCalledWith(mockRequestDto);
            expect(service.getTrafficByProject).toHaveBeenCalledTimes(1);
        });
    });

    describe('getTrafficDailyDifferenceByGeneration()는 ', () => {
        const mockRequestDto = { generation: 9 };
        const mockResponseDto = {
            traffic_daily_difference: '+9100',
        };

        it('전일 대비 트래픽 차이를 리턴해야 한다', async () => {
            mockLogService.getTrafficDailyDifferenceByGeneration.mockResolvedValue(mockResponseDto);

            const result = await controller.getTrafficDailyDifferenceByGeneration(mockRequestDto);

            expect(result).toEqual(mockResponseDto);
            expect(result).toHaveProperty('traffic_daily_difference');
            expect(service.getTrafficDailyDifferenceByGeneration).toHaveBeenCalledWith(
                mockRequestDto,
            );
            expect(service.getTrafficDailyDifferenceByGeneration).toHaveBeenCalledTimes(1);
        });

        it('에러 발생 시, 예외를 throw 해야 한다', async () => {
            const error = new Error('Database error');
            mockLogService.getTrafficDailyDifferenceByGeneration.mockRejectedValue(error);

            await expect(
                controller.getTrafficDailyDifferenceByGeneration(mockRequestDto),
            ).rejects.toThrow(error);

            expect(service.getTrafficDailyDifferenceByGeneration).toHaveBeenCalledWith(
                mockRequestDto,
            );
            expect(service.getTrafficDailyDifferenceByGeneration).toHaveBeenCalledTimes(1);
        });
    });

    describe('getDAUByProject()는', () => {
        const mockRequestDto = { projectName: 'example-project', date: '2024-11-01' };

        const mockResponseDto = {
            projectName: 'example-project',
            date: '2024-11-01',
            dau: 125,
        };

        it('프로젝트명과 날짜가 들어왔을 때 DAU 데이터를 반환해야 한다', async () => {
            mockLogService.getDAUByProject.mockResolvedValue(mockResponseDto);

            const result = await controller.getDAUByProject(mockRequestDto);

            expect(result).toEqual(mockResponseDto);
            expect(result).toHaveProperty('projectName', mockRequestDto.projectName);
            expect(result).toHaveProperty('date', mockRequestDto.date);
            expect(result).toHaveProperty('dau', 125);
            expect(service.getDAUByProject).toHaveBeenCalledWith(mockRequestDto);
            expect(service.getDAUByProject).toHaveBeenCalledTimes(1);
        });

        it('서비스 에러 시 예외를 throw 해야 한다', async () => {
            const error = new Error('Database error');
            mockLogService.getDAUByProject.mockRejectedValue(error);

            await expect(controller.getDAUByProject(mockRequestDto)).rejects.toThrow(error);

            expect(service.getDAUByProject).toHaveBeenCalledWith(mockRequestDto);
            expect(service.getDAUByProject).toHaveBeenCalledTimes(1);
        });
    });
});
