import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('AnalyticsController 테스트', () => {
    let controller: AnalyticsController;
    let service: AnalyticsService;

    const mockLogService = {
        getDAUsByProject: jest.fn(),
    };

    const mockCacheManager = {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AnalyticsController],
            providers: [
                {
                    provide: AnalyticsService,
                    useValue: mockLogService,
                },
                {
                    provide: CACHE_MANAGER,
                    useValue: mockCacheManager,
                },
            ],
        }).compile();

        controller = module.get<AnalyticsController>(AnalyticsController);
        service = module.get<AnalyticsService>(AnalyticsService);

        jest.clearAllMocks();
    });

    it('컨트롤러가 정의되어 있어야 한다', () => {
        expect(controller).toBeDefined();
    });

    describe('getProjectDAU()는', () => {
        const mockRequestDto = { projectName: 'example-project' };

        const mockResponseDto = {
            projectName: 'example-project',
            dauRecords: { date: '2024-11-01', dau: 125 },
        };

        it('프로젝트명과 날짜가 들어왔을 때 DAU 데이터를 반환해야 한다', async () => {
            mockLogService.getDAUsByProject.mockResolvedValue(mockResponseDto);

            const result = await controller.getDAUsByProject(mockRequestDto);

            expect(result).toEqual(mockResponseDto);
            expect(result).toHaveProperty('projectName', mockRequestDto.projectName);
            expect(result).toHaveProperty('dauRecords');
            expect(result.dauRecords).toHaveProperty('dau', 125);
            expect(service.getDAUsByProject).toHaveBeenCalledWith(mockRequestDto);
            expect(service.getDAUsByProject).toHaveBeenCalledTimes(1);
        });

        it('서비스 에러 시 예외를 throw 해야 한다', async () => {
            const error = new Error('Database error');
            mockLogService.getDAUsByProject.mockRejectedValue(error);

            await expect(controller.getDAUsByProject(mockRequestDto)).rejects.toThrow(error);

            expect(service.getDAUsByProject).toHaveBeenCalledWith(mockRequestDto);
            expect(service.getDAUsByProject).toHaveBeenCalledTimes(1);
        });
    });
});
