import { AnalyticsService } from './analytics.service';
import { AnalyticsRepository } from './analytics.repository';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '../../project/entities/project.entity';
import { NotFoundException } from '@nestjs/common';
import type { DauMetric } from './metric/dau.metric';

describe('AnalyticsService 테스트', () => {
    let service: AnalyticsService;

    const mockAnalyticsRepository = {
        findDAUsByProject: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AnalyticsService,
                {
                    provide: AnalyticsRepository,
                    useValue: mockAnalyticsRepository,
                },
                {
                    provide: getRepositoryToken(Project),
                    useValue: { findOne: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<AnalyticsService>(AnalyticsService);
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-11-26T00:00:00.000Z'));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('서비스가 정의될 수 있어야 한다.', () => {
        expect(service).toBeDefined();
    });

    describe('getDAUsByProject()는', () => {
        const mockRequestDto = { projectName: 'example-project' };
        const mockProject = {
            name: 'example-project',
            domain: 'example.com',
        };

        it('프로젝트명으로 도메인을 조회한 후 최근 30일의 DAU 데이터를 반환해야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(mockProject);
            const mockDAUData: DauMetric[] = [
                { date: new Date('2024-11-01'), dau: 50 },
                { date: new Date('2024-11-05'), dau: 70 },
                { date: new Date('2024-11-10'), dau: 90 },
            ];
            mockAnalyticsRepository.findDAUsByProject = jest.fn().mockResolvedValue(mockDAUData);

            const { start, end } = service['calculateDAUsStartEndDate']();
            const result = await service.getDAUsByProject(mockRequestDto);
            const dauRecordsMap = new Map(result.dauRecords.map((rec) => [rec.date, rec.dau]));

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(mockAnalyticsRepository.findDAUsByProject).toHaveBeenCalledWith(
                mockProject.domain,
                start,
                end,
            );
            expect(result.projectName).toEqual(mockRequestDto.projectName);
            expect(result.dauRecords).toHaveLength(30);
            expect(dauRecordsMap.get('2024-11-01')).toBe(50);
            expect(dauRecordsMap.get('2024-11-05')).toBe(70);
            expect(dauRecordsMap.get('2024-11-10')).toBe(90);
            expect(dauRecordsMap.get('2024-11-02')).toBe(0);
        });

        it('존재하지 않는 프로젝트명을 조회할 경우 NotFoundException을 던져야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(null);

            await expect(service.getDAUsByProject(mockRequestDto)).rejects.toThrow(
                new NotFoundException(`Project with name ${mockRequestDto.projectName} not found`),
            );

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(mockAnalyticsRepository.findDAUsByProject).not.toHaveBeenCalled();
        });

        it('존재하는 프로젝트에 DAU 데이터가 없을 경우 DAU 값을 0으로 채워 반환해야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(mockProject);

            mockAnalyticsRepository.findDAUsByProject = jest.fn().mockResolvedValue([]);

            const result = await service.getDAUsByProject(mockRequestDto);

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            const { start, end } = service['calculateDAUsStartEndDate']();

            expect(mockAnalyticsRepository.findDAUsByProject).toHaveBeenCalledWith(
                mockProject.domain,
                start,
                end,
            );

            expect(result.projectName).toEqual(mockRequestDto.projectName);
            expect(result.dauRecords).toHaveLength(30);

            result.dauRecords.forEach((record) => {
                expect(record.dau).toBe(0);
            });
        });

        it('로그 레포지토리 호출 중 에러가 발생할 경우 예외를 던져야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(mockProject);

            mockAnalyticsRepository.findDAUsByProject = jest
                .fn()
                .mockRejectedValue(new Error('Database error'));

            await expect(service.getDAUsByProject(mockRequestDto)).rejects.toThrow(
                'Database error',
            );

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
        });
    });
});
