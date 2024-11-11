import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import type { CreateProjectDto } from './dto/create-project.dto';
import { ConflictException } from '@nestjs/common';

describe('ProjectController의', () => {
  let projectController: ProjectController;

  const mockProjectService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [{ provide: ProjectService, useValue: mockProjectService }],
    }).compile();

    projectController = module.get<ProjectController>(ProjectController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()는', () => {
    const createProjectDto: CreateProjectDto = {
      name: '테스트 프로젝트',
      email: 'test@test.com',
      ip: '127.0.0.1',
      domain: 'host.test.com',
    };

    it('올바른 프로젝트 정보가 들어왔을 때 서비스의 create() 메소드를 호출해 프로젝트를 생성합니다.', async () => {
      const result = { id: 1, ...createProjectDto };
      (mockProjectService.create as jest.Mock).mockResolvedValue(result);

      const response = await projectController.create(createProjectDto);

      expect(response).toEqual(result);
      expect(mockProjectService.create).toHaveBeenCalledWith(createProjectDto);
    });

    it('이미 존재하는 프로젝트 정보가 들어왔을 때 ConflictException을 던집니다.', async () => {
      (mockProjectService.create as jest.Mock).mockRejectedValue(
        new ConflictException(),
      );

      await expect(projectController.create(createProjectDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockProjectService.create).toHaveBeenCalledWith(createProjectDto);
    });
  });
});
