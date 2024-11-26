import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { GetTrafficTop5Dto } from './dto/get-traffic-top5.dto';
import { TrafficController } from './traffic.controller';
import { TrafficService } from './traffic.service';

interface TrafficRankResponseType {
    status: number;
    data: Array<{ host: string; count: number }>;
}

describe('TrafficController 테스트', () => {
    let controller: TrafficController;
    let service: TrafficService;

    const mockTrafficService = {
        getTrafficTop5: jest.fn(),
        getTrafficByGeneration: jest.fn(),
        getTrafficByProject: jest.fn(),
        getTrafficDailyDifferenceByGeneration: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TrafficController],
            providers: [
                {
                    provide: TrafficService,
                    useValue: mockTrafficService,
                },
            ],
        }).compile();

        controller = module.get<TrafficController>(TrafficController);
        service = module.get<TrafficService>(TrafficService);

        jest.clearAllMocks();
    });

    it('컨트롤러가 정의되어 있어야 한다', () => {
        expect(controller).toBeDefined();
    });

    describe('getTrafficDailyDifferenceByGeneration()는 ', () => {
        const mockRequestDto = { generation: 9 };
        const mockResponseDto = {
            traffic_daily_difference: '+9100',
        };

        it('전일 대비 트래픽 차이를 리턴해야 한다', async () => {
            mockTrafficService.getTrafficDailyDifferenceByGeneration.mockResolvedValue(
                mockResponseDto,
            );

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
            mockTrafficService.getTrafficDailyDifferenceByGeneration.mockRejectedValue(error);

            await expect(
                controller.getTrafficDailyDifferenceByGeneration(mockRequestDto),
            ).rejects.toThrow(error);

            expect(service.getTrafficDailyDifferenceByGeneration).toHaveBeenCalledWith(
                mockRequestDto,
            );
            expect(service.getTrafficDailyDifferenceByGeneration).toHaveBeenCalledTimes(1);
        });
    });

    describe('getTrafficByProject()는', () => {
        const mockRequestDto = { projectName: 'example-project', timeRange: 'month' as const };
        const mockResponseDto = {
            projectName: 'example-project',
            timeRange: 'month',
            trafficData: [
                { timestamp: '2024-11-01', count: 14 },
                { timestamp: '2024-10-01', count: 10 },
            ],
        };
        it('프로젝트의 시간 단위별 트래픽 데이터를 반환해야 한다', async () => {
            mockTrafficService.getTrafficByProject.mockResolvedValue(mockResponseDto);

            const result = await controller.getTrafficByProject(mockRequestDto);

            expect(result).toEqual(mockResponseDto);
            expect(result).toHaveProperty('projectName', mockRequestDto.projectName);
            expect(result).toHaveProperty('timeRange', mockRequestDto.timeRange);
            expect(result.trafficData).toHaveLength(2);
            expect(result.trafficData[0]).toHaveProperty('timestamp', '2024-11-01');
            expect(result.trafficData[0]).toHaveProperty('count', 14);
            expect(service.getTrafficByProject).toHaveBeenCalledWith(mockRequestDto);
            expect(service.getTrafficByProject).toHaveBeenCalledTimes(1);
        });

        it('서비스 에러 시 예외를 throw 해야 한다', async () => {
            const error = new Error('Database error');
            mockTrafficService.getTrafficByProject.mockRejectedValue(error);

            await expect(controller.getTrafficByProject(mockRequestDto)).rejects.toThrow(error);

            expect(service.getTrafficByProject).toHaveBeenCalledWith(mockRequestDto);
            expect(service.getTrafficByProject).toHaveBeenCalledTimes(1);
        });

        it('빈 트래픽 데이터를 반환해야 한다 (No Data)', async () => {
            const emptyResponseDto = {
                projectName: 'example-project',
                timeRange: 'month',
                trafficData: [],
            };
            mockTrafficService.getTrafficByProject.mockResolvedValue(emptyResponseDto);

            const result = await controller.getTrafficByProject(mockRequestDto);

            expect(result).toEqual(emptyResponseDto);
            expect(result).toHaveProperty('projectName', mockRequestDto.projectName);
            expect(result).toHaveProperty('timeRange', mockRequestDto.timeRange);
            expect(result.trafficData).toHaveLength(0);
            expect(service.getTrafficByProject).toHaveBeenCalledWith(mockRequestDto);
            expect(service.getTrafficByProject).toHaveBeenCalledTimes(1);
        });
    });

    describe('trafficByGeneration()는 ', () => {
        it('기수별 트래픽 총량을 올바르게 반환해야 한다', async () => {
            const mockTrafficByGenerationDto = { generation: 9 };
            const mockResponse = { count: 1000 };

            mockTrafficService.getTrafficByGeneration.mockResolvedValue(mockResponse);

            const result = await controller.getTrafficByGeneration(mockTrafficByGenerationDto);

            expect(result).toEqual(mockResponse);
            expect(result).toHaveProperty('count', 1000);
            expect(service.getTrafficByGeneration).toHaveBeenCalledWith(mockTrafficByGenerationDto);
            expect(service.getTrafficByGeneration).toHaveBeenCalledTimes(1);
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
            mockTrafficService.getTrafficTop5.mockResolvedValue(mockResult);

            const getTrafficTop5Dto = plainToInstance(GetTrafficTop5Dto, { generation: 1 });
            const result = (await controller.getTrafficTop5(
                getTrafficTop5Dto,
            )) as unknown as TrafficRankResponseType;

            expect(result).toEqual(mockResult);
            expect(result).toHaveProperty('status', HttpStatus.OK);
            expect(result.data).toHaveLength(5);
            expect(mockTrafficService.getTrafficTop5).toHaveBeenCalledTimes(1);

            const sortedData = [...result.data].sort((a, b) => b.count - a.count);
            expect(result.data).toEqual(sortedData);
        });
    });
});
