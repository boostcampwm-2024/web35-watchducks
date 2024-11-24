import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticService } from './analytic.service';
import { AnalyticController } from './analytic.controller';

describe('AnalyticController 테스트', () => {
    let controller: AnalyticController;
    let service: AnalyticService;

    const mockLogService = {
        getProjectDAU: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AnalyticController],
            providers: [
                {
                    provide: AnalyticService,
                    useValue: mockLogService,
                },
            ],
        }).compile();

        controller = module.get<AnalyticController>(AnalyticController);
        service = module.get<AnalyticService>(AnalyticService);

        jest.clearAllMocks();
    });

    it('컨트롤러가 정의되어 있어야 한다', () => {
        expect(controller).toBeDefined();
    });

    describe('getProjectDAU()는', () => {
        const mockRequestDto = { projectName: 'example-project', date: '2024-11-01' };

        const mockResponseDto = {
            projectName: 'example-project',
            date: '2024-11-01',
            dau: 125,
        };

        it('프로젝트명과 날짜가 들어왔을 때 DAU 데이터를 반환해야 한다', async () => {
            mockLogService.getProjectDAU.mockResolvedValue(mockResponseDto);

            const result = await controller.getProjectDAU(mockRequestDto);

            expect(result).toEqual(mockResponseDto);
            expect(result).toHaveProperty('projectName', mockRequestDto.projectName);
            expect(result).toHaveProperty('date', mockRequestDto.date);
            expect(result).toHaveProperty('dau', 125);
            expect(service.getProjectDAU).toHaveBeenCalledWith(mockRequestDto);
            expect(service.getProjectDAU).toHaveBeenCalledTimes(1);
        });

        it('서비스 에러 시 예외를 throw 해야 한다', async () => {
            const error = new Error('Database error');
            mockLogService.getProjectDAU.mockRejectedValue(error);

            await expect(controller.getProjectDAU(mockRequestDto)).rejects.toThrow(error);

            expect(service.getProjectDAU).toHaveBeenCalledWith(mockRequestDto);
            expect(service.getProjectDAU).toHaveBeenCalledTimes(1);
        });
    });
});
