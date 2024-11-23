import { SuccessRateService } from './success-rate.service';
import { SuccessRateRepository } from './success-rate.repository';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '../../project/entities/project.entity';
import { GetProjectSuccessRateResponseDto } from './dto/get-project-success-rate-response.dto';
import { NotFoundException } from '@nestjs/common';

describe('SuccessRateService 테스트', () => {
    let service: SuccessRateService;
    let repository: SuccessRateRepository;

    const mockSuccessRateRepository = {
        findSuccessRate: jest.fn(),
        findSuccessRateByProject: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SuccessRateService,
                {
                    provide: SuccessRateRepository,
                    useValue: mockSuccessRateRepository,
                },
                {
                    provide: getRepositoryToken(Project),
                    useValue: { findOne: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<SuccessRateService>(SuccessRateService);
        repository = module.get<SuccessRateRepository>(SuccessRateRepository);

        jest.clearAllMocks();
    });

    it('서비스가 정의될 수 있어야 한다.', () => {
        expect(service).toBeDefined();
    });

    describe('responseSuccessRate()는 ', () => {
        it('응답 성공률을 반환할 수 있어야 한다.', async () => {
            const mockSuccessRateDto = { generation: 9 };
            const mockRepositoryResponse = { success_rate: 98.5 };
            mockSuccessRateRepository.findSuccessRate.mockResolvedValue(mockRepositoryResponse);
            const expectedResult = { success_rate: 98.5 };

            const result = await service.getSuccessRate(mockSuccessRateDto);

            expect(result).toEqual(expectedResult);
            expect(repository.findSuccessRate).toHaveBeenCalled();
        });
    });

    describe('getProjectSuccessRate()는 ', () => {
        const mockRequestDto = { projectName: 'example-project' };
        const mockProject = {
            name: 'example-project',
            domain: 'example.com',
        };
        const mockSuccessRate = { success_rate: 95.5 };

        it('projectName을 이용해 도메인을 조회한 후 응답 성공률을 반환해야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(mockProject);

            mockSuccessRateRepository.findSuccessRateByProject = jest
                .fn()
                .mockResolvedValue(mockSuccessRate);

            const result = await service.getProjectSuccessRate(mockRequestDto);

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(mockSuccessRateRepository.findSuccessRateByProject).toHaveBeenCalledWith(
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

            mockSuccessRateRepository.findSuccessRateByProject.mockResolvedValue(mockSuccessRate);

            const result = await service.getProjectSuccessRate(mockRequestDto);

            expect(result).toBeInstanceOf(GetProjectSuccessRateResponseDto);
            expect(Object.keys(result)).toContain('projectName');
            expect(Object.keys(result)).toContain('success_rate');
            expect(Object.keys(result).length).toBe(2);
            expect(result.projectName).toBe(mockRequestDto.projectName);
            expect(result.success_rate).toBe(mockSuccessRate.success_rate);
        });

        it('존재하지 않는 프로젝트명을 받은 경우, NotFoundException을 던져야 한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(null);

            await expect(service.getProjectSuccessRate(mockRequestDto)).rejects.toThrow(
                new NotFoundException(`Project with name ${mockRequestDto.projectName} not found`),
            );

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(mockSuccessRateRepository.findSuccessRateByProject).not.toHaveBeenCalled();
        });

        it('레포지토리 호출 시, 에러가 발생하면, 에러를 발생시켜야한다', async () => {
            const projectRepository = service['projectRepository'];
            projectRepository.findOne = jest.fn().mockResolvedValue(mockProject);

            mockSuccessRateRepository.findSuccessRateByProject = jest
                .fn()
                .mockRejectedValue(new Error('Database error'));

            await expect(service.getProjectSuccessRate(mockRequestDto)).rejects.toThrow(
                'Database error',
            );

            expect(projectRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRequestDto.projectName },
                select: ['domain'],
            });
            expect(mockSuccessRateRepository.findSuccessRateByProject).toHaveBeenCalledWith(
                mockProject.domain,
            );
        });
    });
});
