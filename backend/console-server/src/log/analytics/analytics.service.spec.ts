import { AnalyticsService } from './analytics.service';
import { AnalyticsRepository } from './analytics.repository';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '../../project/entities/project.entity';
import { NotFoundException } from '@nestjs/common';

describe('AnalyticsService 테스트', () => {
    let service: AnalyticsService;

    const mockLogRepository = {
        findDAUByProject: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AnalyticsService,
                {
                    provide: AnalyticsRepository,
                    useValue: mockLogRepository,
                },
                {
                    provide: getRepositoryToken(Project),
                    useValue: { findOne: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<AnalyticsService>(AnalyticsService);

        jest.clearAllMocks();
    });

    it('서비스가 정의될 수 있어야 한다.', () => {
        expect(service).toBeDefined();
    });

    describe('getProjectDAU()는', () => {
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

            const result = await service.getProjectDAU(mockRequestDto);

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

            await expect(service.getProjectDAU(mockRequestDto)).rejects.toThrow(
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

            const result = await service.getProjectDAU(mockRequestDto);

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

            await expect(service.getProjectDAU(mockRequestDto)).rejects.toThrow('Database error');

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
