import { ElapsedTimeController } from './elapsed-time.controller';
import { ElapsedTimeService } from './elapsed-time.service';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { GetAvgElapsedTimeDto } from './dto/get-avg-elapsed-time.dto';

describe('ElapsedTimeController 테스트', () => {
    let controller: ElapsedTimeController;
    let service: ElapsedTimeService;

    const mockElapsedTimeService = {
        getAvgElapsedTime: jest.fn(),
        getPathElapsedTimeRank: jest.fn(),
        getTop5ElapsedTime: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ElapsedTimeController],
            providers: [
                {
                    provide: ElapsedTimeService,
                    useValue: mockElapsedTimeService,
                },
            ],
        }).compile();

        controller = module.get<ElapsedTimeController>(ElapsedTimeController);
        service = module.get<ElapsedTimeService>(ElapsedTimeService);

        jest.clearAllMocks();
    });

    it('컨트롤러가 정의되어 있어야 한다', () => {
        expect(controller).toBeDefined();
    });

    describe('elapsedTime()은 ', () => {
        const mockResult = {
            status: HttpStatus.OK,
            data: { avg_elapsed_time: 150 },
        };

        it('평균 응답 시간을 ProjectResponseDto 형식으로 반환해야 한다', async () => {
            mockElapsedTimeService.getAvgElapsedTime.mockResolvedValue(mockResult);

            const result = await controller.getElapsedTime(
                plainToInstance(GetAvgElapsedTimeDto, { generation: 1 }),
            );

            expect(result).toEqual(mockResult);
            expect(result).toHaveProperty('status', HttpStatus.OK);
            expect(result).toHaveProperty('data.avg_elapsed_time');
            expect(service.getAvgElapsedTime).toHaveBeenCalledTimes(1);
        });
    });

    describe('getPathElapsedTimeRank()는 ', () => {
        const mockRequestDto = {
            projectName: 'example-project',
        };

        const mockResponseDto = {
            projectName: 'example-project',
            fastestPaths: [
                { path: '/api/v1/resource', avg_elapsed_time: 123.45 },
                { path: '/api/v1/users', avg_elapsed_time: 145.67 },
                { path: '/api/v1/orders', avg_elapsed_time: 150.89 },
            ],
            slowestPaths: [
                { path: '/api/v1/reports', avg_elapsed_time: 345.67 },
                { path: '/api/v1/logs', avg_elapsed_time: 400.23 },
                { path: '/api/v1/stats', avg_elapsed_time: 450.56 },
            ],
        };

        it('프로젝트의 경로별 응답 속도 순위를 반환해야 한다', async () => {
            mockElapsedTimeService.getPathElapsedTimeRank.mockResolvedValue(mockResponseDto);

            const result = await controller.getPathElapsedTimeRank(mockRequestDto);

            expect(result).toEqual(mockResponseDto);
            expect(service.getPathElapsedTimeRank).toHaveBeenCalledWith(mockRequestDto);
            expect(service.getPathElapsedTimeRank).toHaveBeenCalledTimes(1);

            expect(result).toHaveProperty('projectName', mockRequestDto.projectName);
            expect(result.fastestPaths).toHaveLength(3);
            expect(result.slowestPaths).toHaveLength(3);
        });

        it('서비스 에러 시 예외를 throw 해야 한다', async () => {
            const error = new Error('Database error');
            mockElapsedTimeService.getPathElapsedTimeRank.mockRejectedValue(error);

            await expect(controller.getPathElapsedTimeRank(mockRequestDto)).rejects.toThrow(error);

            expect(service.getPathElapsedTimeRank).toHaveBeenCalledWith(mockRequestDto);
            expect(service.getPathElapsedTimeRank).toHaveBeenCalledTimes(1);
        });

        describe('getTop5ElapsedTime()는', () => {
            const mockRequestDto = {
                generation: 5,
            };

            const mockResponseDto = [
                { projectName: 'project1', avgElapsedTime: 123.45 },
                { projectName: 'project2', avgElapsedTime: 145.67 },
                { projectName: 'project3', avgElapsedTime: 150.89 },
                { projectName: 'project4', avgElapsedTime: 180.23 },
                { projectName: 'project5', avgElapsedTime: 200.34 },
            ];

            it('응답 속도 TOP5 데이터를 반환해야 한다', async () => {
                mockElapsedTimeService.getTop5ElapsedTime.mockResolvedValue(mockResponseDto);

                const result = await controller.getTop5ElapsedTime(mockRequestDto);

                expect(result).toEqual(mockResponseDto);
                expect(result).toHaveLength(5);
                expect(result[0]).toHaveProperty('projectName', 'project1');
                expect(result[0]).toHaveProperty('avgElapsedTime', 123.45);
                expect(service.getTop5ElapsedTime).toHaveBeenCalledWith(mockRequestDto);
                expect(service.getTop5ElapsedTime).toHaveBeenCalledTimes(1);
            });

            it('서비스 메소드 호출시 에러가 발생하면 예외를 throw 해야 한다', async () => {
                const error = new Error('Database error');
                mockElapsedTimeService.getTop5ElapsedTime.mockRejectedValue(error);

                await expect(controller.getTop5ElapsedTime(mockRequestDto)).rejects.toThrow(error);

                expect(service.getTop5ElapsedTime).toHaveBeenCalledWith(mockRequestDto);
                expect(service.getTop5ElapsedTime).toHaveBeenCalledTimes(1);
            });

            it('데이터가 없을 때 빈 배열을 반환한다', async () => {
                mockElapsedTimeService.getTop5ElapsedTime.mockResolvedValue([]);

                const result = await controller.getTop5ElapsedTime(mockRequestDto);

                expect(result).toEqual([]);
                expect(service.getTop5ElapsedTime).toHaveBeenCalledWith(mockRequestDto);
                expect(service.getTop5ElapsedTime).toHaveBeenCalledTimes(1);
            });
        });
    });
});
