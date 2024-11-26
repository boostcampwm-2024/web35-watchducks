import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { RankController } from './rank.controller';
import { RankService } from './rank.service';
import type { GetSuccessRateRankDto } from './dto/get-success-rate-rank.dto';
import type { GetDAURankDto } from './dto/get-dau-rank.dto';

describe('RankController', () => {
    let controller: RankController;
    let service: RankService;

    const mockRankService = {
        getSuccessRateRank: jest.fn(),
        getDAURank: jest.fn(),
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
        const mockDto: GetSuccessRateRankDto = {
            generation: 1,
        };

        const mockResponse = {
            rankings: [
                {
                    rank: 1,
                    teamName: 'Team A',
                    successRate: 98.5,
                },
                {
                    rank: 2,
                    teamName: 'Team B',
                    successRate: 97.2,
                },
            ],
        };

        describe('getSuccessRateRank()는', () => {
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

            it('서비스 계층에서 오류가 발생하면 해당 오류를 그대로 던져야 한다', async () => {
                const error = new Error('Service error');
                mockRankService.getDAURank.mockRejectedValue(error);

                await expect(controller.getDAURank(mockDto)).rejects.toThrow(error);
                expect(service.getDAURank).toHaveBeenCalledWith(mockDto);
            });
        });
    });
});
