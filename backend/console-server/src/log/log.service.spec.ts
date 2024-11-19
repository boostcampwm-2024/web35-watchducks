import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { LogService } from './log.service';
import { LogRepository } from './log.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '../project/entities/project.entity';
import { NotFoundException } from '@nestjs/common';

describe('LogService 테스트', () => {
    let service: LogService;
    let repository: LogRepository;

    const mockLogRepository = {
        findHttpLog: jest.fn(),
        findAvgElapsedTime: jest.fn(),
        findCountByHost: jest.fn(),
        findResponseSuccessRate: jest.fn(),
        findTrafficByGeneration: jest.fn(),
        getPathSpeedRankByProject: jest.fn(),
        getTrafficByProject: jest.fn(),
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
            const mockSuccessRateDto = { generation: 5 };
            const mockRepositoryResponse = { success_rate: 98.5 };
            mockLogRepository.findResponseSuccessRate.mockResolvedValue(mockRepositoryResponse);
            const expectedResult = { success_rate: 98.5 };

            const result = await service.getResponseSuccessRate(mockSuccessRateDto);

            expect(result).toEqual(expectedResult);
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
});
