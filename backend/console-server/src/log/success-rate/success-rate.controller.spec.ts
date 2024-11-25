import { SuccessRateController } from './success-rate.controller';
import { SuccessRateService } from './success-rate.service';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('SuccessRateController 테스트', () => {
    let controller: SuccessRateController;
    let service: SuccessRateService;

    const mockSuccessRateService = {
        getSuccessRate: jest.fn(),
        getProjectSuccessRate: jest.fn(),
    };

    const mockCacheManager = {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SuccessRateController],
            providers: [
                {
                    provide: SuccessRateService,
                    useValue: mockSuccessRateService,
                },
                {
                    provide: CACHE_MANAGER,
                    useValue: mockCacheManager,
                },
            ],
        }).compile();

        controller = module.get<SuccessRateController>(SuccessRateController);
        service = module.get<SuccessRateService>(SuccessRateService);

        jest.clearAllMocks();
    });

    it('컨트롤러가 정의되어 있어야 한다', () => {
        expect(controller).toBeDefined();
    });

    describe('getSuccessRate()는 ', () => {
        const mockSuccessRateDto = { generation: 5 };
        const mockServiceResponse = { success_rate: 98.5 };

        it('응답 성공률을 반환해야 한다', async () => {
            mockSuccessRateService.getSuccessRate.mockResolvedValue(mockServiceResponse);

            const result = await controller.getSuccessRate(mockSuccessRateDto);

            expect(result).toEqual({ success_rate: 98.5 });
            expect(service.getSuccessRate).toHaveBeenCalledWith(mockSuccessRateDto);
            expect(service.getSuccessRate).toHaveBeenCalledTimes(1);
        });
    });

    describe('getProjectSuccessRate()는 ', () => {
        const mockRequestDto = { projectName: 'example-project' };
        const mockServiceResponse = {
            projectName: 'example-project',
            success_rate: 95.5,
        };

        it('해당 프로젝트의 응답 성공률을 반환해야 한다', async () => {
            mockSuccessRateService.getProjectSuccessRate.mockResolvedValue(mockServiceResponse);

            const result = await controller.getProjectSuccessRate(mockRequestDto);

            expect(result).toEqual(mockServiceResponse);
            expect(result).toHaveProperty('projectName', 'example-project');
            expect(result).toHaveProperty('success_rate', 95.5);
            expect(service.getProjectSuccessRate).toHaveBeenCalledWith(mockRequestDto);
            expect(service.getProjectSuccessRate).toHaveBeenCalledTimes(1);
        });

        it('서비스 호출 시, 에러가 발생하면 예외를 throw 해야 한다', async () => {
            const error = new Error('Database error');
            mockSuccessRateService.getProjectSuccessRate.mockRejectedValue(error);

            await expect(controller.getProjectSuccessRate(mockRequestDto)).rejects.toThrow(error);

            expect(service.getProjectSuccessRate).toHaveBeenCalledWith(mockRequestDto);
            expect(service.getProjectSuccessRate).toHaveBeenCalledTimes(1);
        });

        it('성공률이 100%인 경우에도 정상적으로 반환해야 한다', async () => {
            const perfectRateResponse = {
                projectName: 'example-project',
                success_rate: 100,
            };
            mockSuccessRateService.getProjectSuccessRate.mockResolvedValue(perfectRateResponse);

            const result = await controller.getProjectSuccessRate(mockRequestDto);

            expect(result).toEqual(perfectRateResponse);
            expect(result.success_rate).toBe(100);
            expect(service.getProjectSuccessRate).toHaveBeenCalledWith(mockRequestDto);
            expect(service.getProjectSuccessRate).toHaveBeenCalledTimes(1);
        });
    });
});
