import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { LogService } from './log.service';
import { LogRepository } from './log.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '../project/entities/project.entity';
import { NotFoundException } from '@nestjs/common';
import type { GetTrafficByGenerationResponseDto } from './traffic/dto/get-traffic-by-generation-response.dto';
import { GetTrafficByGenerationDto } from './traffic/dto/get-traffic-by-generation.dto';
import { GetProjectSuccessRateResponseDto } from './success-rate/dto/get-project-success-rate-response.dto';
import type { GetTrafficDailyDifferenceDto } from './traffic/dto/get-traffic-daily-difference.dto';
import { GetTrafficDailyDifferenceResponseDto } from './traffic/dto/get-traffic-daily-difference-response.dto';
import { plainToInstance } from 'class-transformer';
import { GetTrafficTop5Dto } from './traffic/dto/get-traffic-top5.dto';

describe('LogService 테스트', () => {
    let service: LogService;
    let repository: LogRepository;

    const mockLogRepository = {
        findAvgElapsedTime: jest.fn(),
        findTop5CountByHost: jest.fn(),
        findResponseSuccessRate: jest.fn(),
        findResponseSuccessRateByProject: jest.fn(),
        findTrafficByGeneration: jest.fn(),
        findPathSpeedRankByProject: jest.fn(),
        findTrafficByProject: jest.fn(),
        findTrafficDailyDifferenceByGeneration: jest.fn(),
        findTrafficForTimeRange: jest.fn(),
        findDAUByProject: jest.fn(),
        findSpeedRank: jest.fn(),
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

            mockLogRepository.findDAUByProject = jest.fn().mockResolvedValue(mockDAUData);

            const result = await service.getDAUByProject(mockRequestDto);

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(mockLogRepository.findDAUByProject).toHaveBeenCalledWith(
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
            expect(mockLogRepository.findDAUByProject).not.toHaveBeenCalled();
        });

        it('존재하는 프로젝트에 DAU 데이터가 없을 경우 0으로 반환해야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(mockProject);

            mockLogRepository.findDAUByProject = jest.fn().mockResolvedValue(0);

            const result = await service.getDAUByProject(mockRequestDto);

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(mockLogRepository.findDAUByProject).toHaveBeenCalledWith(
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

            mockLogRepository.findDAUByProject = jest
                .fn()
                .mockRejectedValue(new Error('Database error'));

            await expect(service.getDAUByProject(mockRequestDto)).rejects.toThrow('Database error');

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(mockLogRepository.findDAUByProject).toHaveBeenCalledWith(
                mockProject.domain,
                mockRequestDto.date,
            );
        });
    });
});
