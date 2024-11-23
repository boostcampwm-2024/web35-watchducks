import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { LogController } from './log.controller';
import { LogService } from './log.service';

describe('LogController 테스트', () => {
    let controller: LogController;
    let service: LogService;

    const mockLogService = {
        getDAUByProject: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LogController],
            providers: [
                {
                    provide: LogService,
                    useValue: mockLogService,
                },
            ],
        }).compile();

        controller = module.get<LogController>(LogController);
        service = module.get<LogService>(LogService);

        jest.clearAllMocks();
    });

    it('컨트롤러가 정의되어 있어야 한다', () => {
        expect(controller).toBeDefined();
    });

    describe('getDAUByProject()는', () => {
        const mockRequestDto = { projectName: 'example-project', date: '2024-11-01' };

        const mockResponseDto = {
            projectName: 'example-project',
            date: '2024-11-01',
            dau: 125,
        };

        it('프로젝트명과 날짜가 들어왔을 때 DAU 데이터를 반환해야 한다', async () => {
            mockLogService.getDAUByProject.mockResolvedValue(mockResponseDto);

            const result = await controller.getDAUByProject(mockRequestDto);

            expect(result).toEqual(mockResponseDto);
            expect(result).toHaveProperty('projectName', mockRequestDto.projectName);
            expect(result).toHaveProperty('date', mockRequestDto.date);
            expect(result).toHaveProperty('dau', 125);
            expect(service.getDAUByProject).toHaveBeenCalledWith(mockRequestDto);
            expect(service.getDAUByProject).toHaveBeenCalledTimes(1);
        });

        it('서비스 에러 시 예외를 throw 해야 한다', async () => {
            const error = new Error('Database error');
            mockLogService.getDAUByProject.mockRejectedValue(error);

            await expect(controller.getDAUByProject(mockRequestDto)).rejects.toThrow(error);

            expect(service.getDAUByProject).toHaveBeenCalledWith(mockRequestDto);
            expect(service.getDAUByProject).toHaveBeenCalledTimes(1);
        });
    });
});
