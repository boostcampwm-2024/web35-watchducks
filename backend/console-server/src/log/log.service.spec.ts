import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { LogService } from './log.service';
import { LogRepository } from './log.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '../project/entities/project.entity';
import { NotFoundException } from '@nestjs/common';
import type { GetTrafficByGenerationResponseDto } from './dto/get-traffic-by-generation-response.dto';
import { GetTrafficByGenerationDto } from './dto/get-traffic-by-generation.dto';
import { GetSuccessRateByProjectResponseDto } from './dto/get-success-rate-by-project-response.dto';

describe('LogService 테스트', () => {
    let service: LogService;
    let repository: LogRepository;

    const mockLogRepository = {
        findHttpLog: jest.fn(),
        findAvgElapsedTime: jest.fn(),
        findCountByHost: jest.fn(),
        findResponseSuccessRate: jest.fn(),
        findResponseSuccessRateByProject: jest.fn(),
        findTrafficByGeneration: jest.fn(),
        getPathSpeedRankByProject: jest.fn(),
        getTrafficByProject: jest.fn(),
        getDAUByProject: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LogService,
                {
                    provide: LogRepository,
                    useValue: mockLogRepository,
                },
                {
                    provide: getRepositoryToken(Project),
                    useValue: { findOne: jest.fn() },
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

    describe('elapsedTime()는 ', () => {
        it('평균 응답 시간을 반환할 수 있어야 한다.', async () => {
            const mockTime = { avg_elapsed_time: 150 };
            mockLogRepository.findAvgElapsedTime.mockResolvedValue(mockTime);

            const result = await service.getAvgElapsedTime();

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

            const result = await service.getTrafficRank();

            expect(result).toHaveLength(5);
            expect(result).toEqual(mockRanks.slice(0, 5));
            expect(repository.findTop5CountByHost).toHaveBeenCalled();
        });

        it('5개 이하의 결과에 대해서 올바르게 처리할 수 있어야 한다.', async () => {
            const mockRanks = [
                { host: 'api1.example.com', count: 1000 },
                { host: 'api2.example.com', count: 800 },
            ];
            mockLogRepository.findCountByHost.mockResolvedValue(mockRanks);

            const result = await service.getTrafficRank();

            expect(result).toHaveLength(2);
            expect(result).toEqual(mockRanks);
        });
    });

    describe('responseSuccessRate()는 ', () => {
        it('응답 성공률을 반환할 수 있어야 한다.', async () => {
            const mockSuccessRateDto = { generation: 9 };
            const mockRepositoryResponse = { success_rate: 98.5 };
            mockLogRepository.findResponseSuccessRate.mockResolvedValue(mockRepositoryResponse);
            const expectedResult = { success_rate: 98.5 };

            const result = await service.getResponseSuccessRate(mockSuccessRateDto);

            expect(result).toEqual(expectedResult);
            expect(repository.findResponseSuccessRate).toHaveBeenCalled();
        });
    });

    describe('getResponseSuccessRateByProject()는 ', () => {
        const mockRequestDto = { projectName: 'example-project' };
        const mockProject = {
            name: 'example-project',
            domain: 'example.com',
        };
        const mockSuccessRate = { success_rate: 95.5 };

        it('projectName을 이용해 도메인을 조회한 후 응답 성공률을 반환해야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(mockProject);

            mockLogRepository.findResponseSuccessRateByProject = jest
                .fn()
                .mockResolvedValue(mockSuccessRate);

            const result = await service.getResponseSuccessRateByProject(mockRequestDto);

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(mockLogRepository.findResponseSuccessRateByProject).toHaveBeenCalledWith(
                mockProject.domain,
            );
            expect(result).toEqual(
                expect.objectContaining({
                    success_rate: mockSuccessRate.success_rate,
                }),
            );
        });

        it('응답이 GetSuccessRateByProjectResponseDTO 형태로 변환되어야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(mockProject);

            mockLogRepository.findResponseSuccessRateByProject.mockResolvedValue(mockSuccessRate);

            const result = await service.getResponseSuccessRateByProject(mockRequestDto);

            expect(result).toBeInstanceOf(GetSuccessRateByProjectResponseDto);
            expect(Object.keys(result)).toContain('projectName');
            expect(Object.keys(result)).toContain('success_rate');
            expect(Object.keys(result).length).toBe(2);
            expect(result.projectName).toBe(mockRequestDto.projectName);
            expect(result.success_rate).toBe(mockSuccessRate.success_rate);
        });

        it('존재하지 않는 프로젝트명을 받은 경우, NotFoundException을 던져야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(null);

            await expect(service.getResponseSuccessRateByProject(mockRequestDto)).rejects.toThrow(
                new NotFoundException(`Project with name ${mockRequestDto.projectName} not found`),
            );

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(mockLogRepository.findResponseSuccessRateByProject).not.toHaveBeenCalled();
        });

        it('레포지토리 호출 시, 에러가 발생하면, 예외를 throw 해야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(mockProject);

            mockLogRepository.findResponseSuccessRateByProject = jest
                .fn()
                .mockRejectedValue(new Error('Database error'));

            await expect(service.getResponseSuccessRateByProject(mockRequestDto)).rejects.toThrow(
                'Database error',
            );

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(mockLogRepository.findResponseSuccessRateByProject).toHaveBeenCalledWith(
                mockProject.domain,
            );
        });
    });

    describe('trafficByGeneration()는 ', () => {
        it('기수별 트래픽의 총합을 올바르게 반환할 수 있어야 한다.', async () => {
            const mockStats = [
                { generation: '10s', count: 500 },
                { generation: '20s', count: 300 },
                { generation: '30s', count: 200 },
            ];
            const expectedTotalCount = mockStats.reduce((sum, stat) => sum + stat.count, 0);
            const dto = new GetTrafficByGenerationDto();
            dto.generation = 9;

            const mockRepositoryResponse = [{ count: expectedTotalCount }];
            const expectedResponse: GetTrafficByGenerationResponseDto = {
                count: expectedTotalCount,
            };
            mockLogRepository.findTrafficByGeneration.mockResolvedValue(mockRepositoryResponse);

            const result = await service.getTrafficByGeneration(dto);

            expect(result).toEqual(expectedResponse);
            expect(mockLogRepository.findTrafficByGeneration).toHaveBeenCalledTimes(1);
            expect(mockLogRepository.findTrafficByGeneration).toHaveBeenCalled();
        });
    });

    describe('getPathSpeedRankByProject()는 ', () => {
        const mockRequestDto = { projectName: 'example-project' };

        const mockProject = {
            name: 'example-project',
            domain: 'example.com',
        };

        const mockPathSpeedRank = {
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

        it('프로젝트명을 기준으로 도메인을 조회한 후 경로별 응답 속도 순위를 반환해야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(mockProject);

            mockLogRepository.getPathSpeedRankByProject = jest
                .fn()
                .mockResolvedValue(mockPathSpeedRank);

            const result = await service.getPathSpeedRankByProject(mockRequestDto);

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(mockLogRepository.getPathSpeedRankByProject).toHaveBeenCalledWith(
                mockProject.domain,
            );
            expect(result).toEqual({
                projectName: mockRequestDto.projectName,
                ...mockPathSpeedRank,
            });
        });

        it('존재하지 않는 프로젝트명을 조회할 경우 NotFoundException을 던져야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(null);

            await expect(service.getPathSpeedRankByProject(mockRequestDto)).rejects.toThrow(
                new NotFoundException(`Project with name ${mockRequestDto.projectName} not found`),
            );

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(mockLogRepository.getPathSpeedRankByProject).not.toHaveBeenCalled();
        });

        it('로그 레포지토리 호출 중 에러가 발생할 경우 예외를 던져야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(mockProject);

            mockLogRepository.getPathSpeedRankByProject = jest
                .fn()
                .mockRejectedValue(new Error('Database error'));

            await expect(service.getPathSpeedRankByProject(mockRequestDto)).rejects.toThrow(
                'Database error',
            );

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(mockLogRepository.getPathSpeedRankByProject).toHaveBeenCalledWith(
                mockProject.domain,
            );
        });
    });

    describe('getTrafficByProject()는', () => {
        const mockRequestDto = { projectName: 'example-project', timeUnit: 'month' };
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
            timeUnit: 'month',
            trafficData: mockTrafficData,
        };

        it('프로젝트명을 기준으로 도메인을 조회한 후 트래픽 데이터를 반환해야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(mockProject);

            mockLogRepository.getTrafficByProject = jest.fn().mockResolvedValue(mockTrafficData);

            const result = await service.getTrafficByProject(mockRequestDto);

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(mockLogRepository.getTrafficByProject).toHaveBeenCalledWith(
                mockProject.domain,
                mockRequestDto.timeUnit,
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
            expect(mockLogRepository.getTrafficByProject).not.toHaveBeenCalled();
        });

        it('로그 레포지토리 호출 중 에러가 발생할 경우 예외를 던져야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(mockProject);

            mockLogRepository.getTrafficByProject = jest
                .fn()
                .mockRejectedValue(new Error('Database error'));

            await expect(service.getTrafficByProject(mockRequestDto)).rejects.toThrow(
                'Database error',
            );

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(mockLogRepository.getTrafficByProject).toHaveBeenCalledWith(
                mockProject.domain,
                mockRequestDto.timeUnit,
            );
        });

        it('트래픽 데이터가 없을 경우 빈 배열을 반환해야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(mockProject);

            mockLogRepository.getTrafficByProject = jest.fn().mockResolvedValue([]);

            const result = await service.getTrafficByProject(mockRequestDto);

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(mockLogRepository.getTrafficByProject).toHaveBeenCalledWith(
                mockProject.domain,
                mockRequestDto.timeUnit,
            );
            expect(result).toEqual({
                projectName: mockRequestDto.projectName,
                timeUnit: mockRequestDto.timeUnit,
                trafficData: [],
            });
        });
    });

    describe('getDAUByProject()는', () => {
        const mockRequestDto = { projectName: 'example-project', date: '2024-11-01' };
        const mockProject = {
            name: 'example-project',
            domain: 'example.com',
        };
        const mockDAUData = 125;
        const mockResponseDto = {
            projectName: 'example-project',
            date: '2024-11-01',
            dau: 125,
        };

        it('프로젝트명으로 도메인을 조회한 후 날짜에 따른 DAU 데이터를 반환해야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(mockProject);

            mockLogRepository.getDAUByProject = jest.fn().mockResolvedValue(mockDAUData);

            const result = await service.getDAUByProject(mockRequestDto);

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(mockLogRepository.getDAUByProject).toHaveBeenCalledWith(
                mockProject.domain,
                mockRequestDto.date,
            );
            expect(result).toEqual(mockResponseDto);
        });

        it('존재하지 않는 프로젝트명을 조회할 경우 NotFoundException을 던져야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(null);

            await expect(service.getDAUByProject(mockRequestDto)).rejects.toThrow(
                new NotFoundException(`Project with name ${mockRequestDto.projectName} not found`),
            );

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(mockLogRepository.getDAUByProject).not.toHaveBeenCalled();
        });

        it('존재하는 프로젝트에 DAU 데이터가 없을 경우 0으로 반환해야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(mockProject);

            mockLogRepository.getDAUByProject = jest.fn().mockResolvedValue(0);

            const result = await service.getDAUByProject(mockRequestDto);

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(mockLogRepository.getDAUByProject).toHaveBeenCalledWith(
                mockProject.domain,
                mockRequestDto.date,
            );
            expect(result).toEqual({
                projectName: mockRequestDto.projectName,
                date: mockRequestDto.date,
                dau: 0,
            });
        });

        it('로그 레포지토리 호출 중 에러가 발생할 경우 예외를 던져야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(mockProject);

            mockLogRepository.getDAUByProject = jest
                .fn()
                .mockRejectedValue(new Error('Database error'));

            await expect(service.getDAUByProject(mockRequestDto)).rejects.toThrow('Database error');

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(mockLogRepository.getDAUByProject).toHaveBeenCalledWith(
                mockProject.domain,
                mockRequestDto.date,
            );
        });
    });
});
