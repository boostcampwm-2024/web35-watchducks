import { TrafficService } from './traffic.service';
import { TrafficRepository } from './traffic.repository';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '../../project/entities/project.entity';
import { plainToInstance } from 'class-transformer';
import { GetTrafficTop5Dto } from './dto/get-traffic-top5.dto';
import type { GetTrafficByGenerationResponseDto } from './dto/get-traffic-by-generation-response.dto';
import { GetTrafficByGenerationDto } from './dto/get-traffic-by-generation.dto';
import { NotFoundException } from '@nestjs/common';
import type { GetTrafficDailyDifferenceDto } from './dto/get-traffic-daily-difference.dto';
import { GetTrafficDailyDifferenceResponseDto } from './dto/get-traffic-daily-difference-response.dto';

describe('TrafficService 테스트', () => {
    let service: TrafficService;
    let repository: TrafficRepository;

    const mockTrafficRepository = {
        findTop5CountByHost: jest.fn(),
        findTrafficByGeneration: jest.fn(),
        findTrafficByProject: jest.fn(),
        findTrafficDailyDifferenceByGeneration: jest.fn(),
        findTrafficForTimeRange: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TrafficService,
                {
                    provide: TrafficRepository,
                    useValue: mockTrafficRepository,
                },
                {
                    provide: getRepositoryToken(Project),
                    useValue: { findOne: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<TrafficService>(TrafficService);
        repository = module.get<TrafficRepository>(TrafficRepository);

        jest.clearAllMocks();
    });

    it('서비스가 정의될 수 있어야 한다.', () => {
        expect(service).toBeDefined();
    });

    describe('trafficRank()는 ', () => {
        it('top 5 traffic rank를 리턴할 수 있어야 한다.', async () => {
            const mockRanks = [
                { host: 'api1.example.com', count: 1000 },
                { host: 'api2.example.com', count: 800 },
                { host: 'api3.example.com', count: 600 },
                { host: 'api4.example.com', count: 400 },
                { host: 'api5.example.com', count: 200 },
            ];
            mockTrafficRepository.findTop5CountByHost.mockResolvedValue(mockRanks);

            const result = await service.getTrafficTop5(
                plainToInstance(GetTrafficTop5Dto, { generation: 9 }),
            );

            expect(result).toHaveLength(5);
            expect(result).toEqual(mockRanks.slice(0, 5));
            expect(repository.findTop5CountByHost).toHaveBeenCalled();
        });

        it('5개 이하의 결과에 대해서 올바르게 처리할 수 있어야 한다.', async () => {
            const mockRanks = [
                { host: 'api1.example.com', count: 1000 },
                { host: 'api2.example.com', count: 800 },
            ];
            mockTrafficRepository.findTop5CountByHost.mockResolvedValue(mockRanks);

            const result = await service.getTrafficTop5(
                plainToInstance(GetTrafficTop5Dto, { generation: 9 }),
            );

            expect(result).toHaveLength(2);
            expect(result).toEqual(mockRanks);
        });
    });

    describe('trafficByGeneration()는 ', () => {
        it('기수별 트래픽의 총합을 올바르게 반환할 수 있어야 한다.', async () => {
            const mockRepositoryResponse = { count: 1000 };
            const expectedResponse: GetTrafficByGenerationResponseDto = {
                count: 1000,
            };
            mockTrafficRepository.findTrafficByGeneration.mockResolvedValue(mockRepositoryResponse);

            const result = await service.getTrafficByGeneration(
                plainToInstance(GetTrafficByGenerationDto, { generation: 9 }),
            );

            expect(result).toEqual(expectedResponse);
            expect(mockTrafficRepository.findTrafficByGeneration).toHaveBeenCalledTimes(1);
            expect(mockTrafficRepository.findTrafficByGeneration).toHaveBeenCalled();
        });
    });

    describe('getTrafficByProject()는', () => {
        const mockRequestDto = { projectName: 'example-project', timeRange: 'month' as const };
        const mockProject = {
            name: 'example-project',
            domain: 'example.com',
        };
        const mockTrafficData = [
            { timestamp: '2024-11-01', count: 14 },
            { timestamp: '2024-10-01', count: 10 },
        ];
        const mockResponseDto = {
            projectName: 'example-project',
            timeRange: 'month',
            trafficData: mockTrafficData,
        };

        it('프로젝트명을 기준으로 도메인을 조회한 후 지정된 시간 단위(ex. 1month -> Hour)로 트래픽 데이터를 반환해야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(mockProject);

            service['calculateDateTimeRange'] = jest.fn().mockReturnValue({
                start: new Date('2024-10-01'),
                end: new Date('2024-11-01'),
            });

            mockTrafficRepository.findTrafficByProject = jest
                .fn()
                .mockResolvedValue(mockTrafficData);

            const result = await service.getTrafficByProject(mockRequestDto);

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(service['calculateDateTimeRange']).toHaveBeenCalledWith(
                mockRequestDto.timeRange,
            );
            expect(mockTrafficRepository.findTrafficByProject).toHaveBeenCalledWith(
                mockProject.domain,
                new Date('2024-10-01'),
                new Date('2024-11-01'),
                'Hour',
            );
            expect(result).toEqual(mockResponseDto);
        });

        it('존재하지 않는 프로젝트명을 조회할 경우 NotFoundException을 던져야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(null);

            await expect(service.getTrafficByProject(mockRequestDto)).rejects.toThrow(
                new NotFoundException(`Project with name ${mockRequestDto.projectName} not found`),
            );

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(mockTrafficRepository.findTrafficByProject).not.toHaveBeenCalled();
        });

        it('로그 레포지토리 호출 중 에러가 발생할 경우 예외를 던져야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(mockProject);

            service['calculateDateTimeRange'] = jest.fn().mockReturnValue({
                start: new Date('2024-10-01'),
                end: new Date('2024-11-01'),
            });

            mockTrafficRepository.findTrafficByProject = jest
                .fn()
                .mockRejectedValue(new Error('Database error'));

            await expect(service.getTrafficByProject(mockRequestDto)).rejects.toThrow(
                'Database error',
            );

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(mockTrafficRepository.findTrafficByProject).toHaveBeenCalledWith(
                mockProject.domain,
                new Date('2024-10-01'),
                new Date('2024-11-01'),
                'Hour',
            );
        });

        it('트래픽 데이터가 없을 경우 빈 배열을 반환해야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(mockProject);

            service['calculateDateTimeRange'] = jest.fn().mockReturnValue({
                start: new Date('2024-10-01'),
                end: new Date('2024-11-01'),
            });

            mockTrafficRepository.findTrafficByProject = jest.fn().mockResolvedValue([]);

            const result = await service.getTrafficByProject(mockRequestDto);

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(service['calculateDateTimeRange']).toHaveBeenCalledWith(
                mockRequestDto.timeRange,
            );
            expect(mockTrafficRepository.findTrafficByProject).toHaveBeenCalledWith(
                mockProject.domain,
                new Date('2024-10-01'),
                new Date('2024-11-01'),
                'Hour',
            );
            expect(result).toEqual({
                projectName: mockRequestDto.projectName,
                timeRange: mockRequestDto.timeRange,
                trafficData: [],
            });
        });
    });

    describe('getTrafficDailyDifferenceByGeneration()는 ', () => {
        const mockRequestDto: GetTrafficDailyDifferenceDto = { generation: 9 };
        let mockDate: Date;

        beforeEach(() => {
            mockDate = new Date('2024-03-20T15:00:00Z');
            jest.useFakeTimers();
            jest.setSystemTime(mockDate);
            (mockTrafficRepository.findTrafficForTimeRange as jest.Mock).mockReset();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('전일 대비 총 트래픽 증감량을 리턴해야 한다', async () => {
            const todayTraffic = [{ count: 10000 }];
            const yesterdayTraffic = [{ count: 900 }];

            (mockTrafficRepository.findTrafficForTimeRange as jest.Mock)
                .mockResolvedValueOnce(todayTraffic)
                .mockResolvedValueOnce(yesterdayTraffic);

            const result = await service.getTrafficDailyDifferenceByGeneration(mockRequestDto);

            expect(result).toBeInstanceOf(GetTrafficDailyDifferenceResponseDto);
            expect(result.traffic_daily_difference).toBe('+9100');
            expect(mockTrafficRepository.findTrafficForTimeRange).toHaveBeenCalledTimes(2);
        });

        it('트래픽의 차이가 0인 경우에도 올바르게 처리해야 한다', async () => {
            const sameTraffic = [{ count: 500 }];

            (mockTrafficRepository.findTrafficForTimeRange as jest.Mock)
                .mockResolvedValueOnce(sameTraffic)
                .mockResolvedValueOnce(sameTraffic);

            const result = await service.getTrafficDailyDifferenceByGeneration(mockRequestDto);

            expect(result).toBeInstanceOf(GetTrafficDailyDifferenceResponseDto);
            expect(result.traffic_daily_difference).toBe('0');
        });

        it('레포지토리 호출 시, 발생하는 에러를 throw 해야 한다', async () => {
            (mockTrafficRepository.findTrafficForTimeRange as jest.Mock).mockRejectedValue(
                new Error('Database error'),
            );

            await expect(
                service.getTrafficDailyDifferenceByGeneration(mockRequestDto),
            ).rejects.toThrow('Database error');
        });

        it('시간 범위가 올바르게 계산되어야 한다', async () => {
            const mockTraffic = [{ count: 100 }];
            (mockTrafficRepository.findTrafficForTimeRange as jest.Mock).mockResolvedValue(
                mockTraffic,
            );

            const todayStart = new Date(mockDate);
            todayStart.setHours(0, 0, 0, 0);

            const yesterdayStart = new Date(mockDate);
            yesterdayStart.setDate(yesterdayStart.getDate() - 1);
            yesterdayStart.setHours(0, 0, 0, 0);

            const yesterdayEnd = new Date(todayStart);
            await service.getTrafficDailyDifferenceByGeneration(mockRequestDto);

            expect(mockTrafficRepository.findTrafficForTimeRange).toHaveBeenNthCalledWith(
                1,
                todayStart,
                expect.any(Date),
            );
            expect(mockTrafficRepository.findTrafficForTimeRange).toHaveBeenNthCalledWith(
                2,
                yesterdayStart,
                yesterdayEnd,
            );
        });
    });
});
