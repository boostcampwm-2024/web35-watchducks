import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';
import { MailService } from '../mail/mail.service';
import type { Repository } from 'typeorm';
import { QueryFailedError } from 'typeorm';
import type { CreateProjectDto } from './dto/create-project.dto';
import { ProjectResponseDto } from './dto/create-project-response.dto';
import { ConflictException } from '@nestjs/common';
import { FindByGenerationDto } from './dto/find-by-generation.dto';
import { FindByGenerationResponseDto } from './dto/find-by-generation-response.dto';
import { plainToInstance } from 'class-transformer';

describe('ProjectService 클래스의', () => {
    let projectService: ProjectService;
    let projectRepository: Repository<Project>;
    let mailService: MailService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectService,
                {
                    provide: getRepositoryToken(Project),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        find: jest.fn(),
                    },
                },
                {
                    provide: MailService,
                    useValue: {
                        sendNameServerInfo: jest.fn(),
                    },
                },
            ],
        }).compile();

        projectService = module.get<ProjectService>(ProjectService);
        projectRepository = module.get<Repository<Project>>(getRepositoryToken(Project));
        mailService = module.get<MailService>(MailService);
    });

    describe('create() 메소드는', () => {
        const createProjectDto: CreateProjectDto = {
            name: '테스트 프로젝트',
            email: 'test@test.com',
            ip: '127.0.0.1',
            domain: 'host.test.com',
        };

        it('올바른 정보가 들어왔을 때 프로젝트를 성공적으로 생성합니다.', async () => {
            const projectEntity = { id: 1, ...createProjectDto };

            (projectRepository.create as jest.Mock).mockReturnValue(projectEntity);
            (projectRepository.save as jest.Mock).mockReturnValue(projectEntity);

            const result = await projectService.create(createProjectDto);

            expect(projectRepository.create).toHaveBeenCalledWith(createProjectDto);
            expect(projectRepository.save).toHaveBeenCalledWith(projectEntity);
            expect(mailService.sendNameServerInfo).toHaveBeenCalledWith(
                createProjectDto.email,
                createProjectDto.name,
            );
            expect(result).toBeInstanceOf(ProjectResponseDto);
        });
        it('이미 존재하는 도메인이 들어오면 ConflictException을 던집니다.', async () => {
            const error = new QueryFailedError('query', [], {
                code: 'ER_DUP_ENTRY',
            } as unknown as Error);

            (projectRepository.create as jest.Mock).mockReturnValue({});
            (projectRepository.save as jest.Mock).mockRejectedValue(error);

            await expect(projectService.create(createProjectDto)).rejects.toThrow(
                ConflictException,
            );
        });
        it('예상치 못한 오류가 발생하면 해당 오류를 그대로 전달합니다.', async () => {
            const error = new Error('예기치 못한 에러');
            (projectRepository.create as jest.Mock).mockReturnValue({});
            (projectRepository.save as jest.Mock).mockRejectedValue(error);

            await expect(projectService.create(createProjectDto)).rejects.toThrow(Error);
        });
    });

    describe('findByGeneration() 메소드는', () => {
        it('특정 기수의 프로젝트 이름 목록을 반환합니다.', async () => {
            // Given
            const generation = 1;
            const findGenerationProjectDto: FindByGenerationDto = {
                generation,
            };

            const mockProjects = [
                { name: 'Project A' },
                { name: 'Project B' },
                { name: 'Project C' },
            ] as Project[];
            const expectedResponse = mockProjects.map((p) =>
                plainToInstance(FindByGenerationResponseDto, p.name),
            );

            (projectRepository.find as jest.Mock).mockResolvedValue(mockProjects);

            // When
            const result = await projectService.findByGeneration(findGenerationProjectDto);

            // Then
            expect(projectRepository.find).toHaveBeenCalledWith({
                select: {
                    name: true,
                },
                where: { generation },
            });

            expect(result).toHaveLength(mockProjects.length);
            expect(result).toEqual(expectedResponse);
        });

        it('프로젝트가 없는 경우 빈 배열을 반환합니다.', async () => {
            // Given
            const generation = 999;
            const findGenerationProjectDto: FindByGenerationDto = {
                generation,
            };

            (projectRepository.find as jest.Mock).mockResolvedValue([]);

            // When
            const result = await projectService.findByGeneration(findGenerationProjectDto);

            // Then
            expect(projectRepository.find).toHaveBeenCalledWith({
                select: {
                    name: true,
                },
                where: { generation },
            });

            expect(result).toHaveLength(0);
            expect(result).toEqual([]);
        });

        it('리포지토리 에러 발생 시 예외를 던집니다.', async () => {
            // Given
            const generation = 1;
            const findGenerationProjectDto: FindByGenerationDto = {
                generation,
            };

            const mockError = new Error('Database error');
            (projectRepository.find as jest.Mock).mockRejectedValue(mockError);

            // When & Then
            await expect(projectService.findByGeneration(findGenerationProjectDto)).rejects.toThrow(
                mockError,
            );

            expect(projectRepository.find).toHaveBeenCalledWith({
                select: {
                    name: true,
                },
                where: { generation },
            });
        });
    });
});
