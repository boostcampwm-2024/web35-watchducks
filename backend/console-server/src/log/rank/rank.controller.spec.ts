import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { RankController } from './rank.controller';
import { RankService } from './rank.service';
import type { GetSuccessRateRankDto } from './dto/get-success-rate-rank.dto';
import type { GetDAURankDto } from './dto/get-dau-rank.dto';
import type { GetSuccessRateRankResponseDto } from './dto/get-success-rate-rank-response.dto';
import type { GetTrafficRankDto } from './dto/get-traffic-rank.dto';
import type { GetTrafficRankResponseDto } from './dto/get-traffic-rank-response.dto';

describe('RankController', () => {
    let controller: RankController;
    let service: RankService;

    const mockRankService = {
        getSuccessRateRank: jest.fn(),
        getDAURank: jest.fn(),
        getTrafficRank: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RankController],
            providers: [
                {
                    provide: RankService,
                    useValue: mockRankService,
                },
            ],
        }).compile();

        controller = module.get<RankController>(RankController);
        service = module.get<RankService>(RankService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('RankController의', () => {
        describe('getSuccessRateRank()는', () => {
            let mockDto: GetSuccessRateRankDto;
            let mockResponse: GetSuccessRateRankResponseDto;

            beforeEach(async () => {
                mockDto = {
                    generation: 1,
                };

                mockResponse = {
                    total: 2,
                    rank: [
                        {
                            projectName: 'watchducks001',
                            successRate: 98.5,
                        },
                        {
                            projectName: 'watchducks002',
                            successRate: 97.2,
                        },
                    ],
                };
            });

            it('정의되어 있어야 한다', () => {
                expect(controller).toBeDefined();
            });

            it('성공률 랭킹 데이터를 반환해야 한다', async () => {
                mockRankService.getSuccessRateRank.mockResolvedValue(mockResponse);

                const result = await controller.getSuccessRateRank(mockDto);

                expect(result).toBe(mockResponse);
                expect(service.getSuccessRateRank).toHaveBeenCalledWith(mockDto);
                expect(service.getSuccessRateRank).toHaveBeenCalledTimes(1);
            });

            it('서비스 계층에서 오류가 발생하면 해당 오류를 그대로 던져야 한다', async () => {
                const error = new Error('Service error');
                mockRankService.getSuccessRateRank.mockRejectedValue(error);

                await expect(controller.getSuccessRateRank(mockDto)).rejects.toThrow(error);
                expect(service.getSuccessRateRank).toHaveBeenCalledWith(mockDto);
            });
        });

        describe('getDAURank()는', () => {
            const mockDto: GetDAURankDto = {
                generation: 9,
            };

            const mockResponse = {
                total: 2,
                rank: [
                    {
                        projectName: 'Project A',
                        dau: 1000,
                    },
                    {
                        projectName: 'Project B',
                        dau: 500,
                    },
                ],
                date: '2024-01-01',
            };

            it('정의되어 있어야 한다', () => {
                expect(controller.getDAURank).toBeDefined();
            });

            it('DAU 랭킹 데이터를 반환해야 한다', async () => {
                mockRankService.getDAURank.mockResolvedValue(mockResponse);

                const result = await controller.getDAURank(mockDto);

                expect(result).toBe(mockResponse);
                expect(service.getDAURank).toHaveBeenCalledWith(mockDto);
                expect(service.getDAURank).toHaveBeenCalledTimes(1);
            });
        });
      
        describe('getTrafficRank()는', () => {
            let mockDto: GetTrafficRankDto;
            let mockResponse: GetTrafficRankResponseDto;

            beforeEach(async () => {
                mockDto = {
                    generation: 1,
                };

                mockResponse = {
                    total: 2,
                    rank: [
                        {
                            projectName: 'watchducks001',
                            count: 10000,
                        },
                        {
                            projectName: 'watchducks002',
                            count: 9998,
                        },
                    ],
                };
            });

            it('정의되어 있어야 한다', () => {
                expect(controller).toBeDefined();
            });

            it('트래픽 랭킹 데이터를 반환해야 한다', async () => {
                mockRankService.getTrafficRank.mockResolvedValue(mockResponse);

                const result = await controller.getTrafficRank(mockDto);

                expect(result).toBe(mockResponse);
                expect(service.getTrafficRank).toHaveBeenCalledWith(mockDto);
                expect(service.getTrafficRank).toHaveBeenCalledTimes(1);
            });

            it('서비스 계층에서 오류가 발생하면 해당 오류를 그대로 던져야 한다', async () => {
                const error = new Error('Service error');

                mockRankService.getDAURank.mockRejectedValue(error);

                await expect(controller.getDAURank(mockDto)).rejects.toThrow(error);
                expect(service.getDAURank).toHaveBeenCalledWith(mockDto);

                mockRankService.getTrafficRank.mockRejectedValue(error);

                await expect(controller.getTrafficRank(mockDto)).rejects.toThrow(error);
                expect(service.getTrafficRank).toHaveBeenCalledWith(mockDto);

            });
        });
    });
});
