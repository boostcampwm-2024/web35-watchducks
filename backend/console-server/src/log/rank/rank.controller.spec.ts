import { Test, TestingModule } from '@nestjs/testing';
import { RankController } from './rank.controller';
import { RankService } from './rank.service';
import { GetSuccessRateRankDto } from './dto/get-success-rate-rank.dto';
import { HttpStatus } from '@nestjs/common';

describe('RankController', () => {
    let controller: RankController;
    let service: RankService;

    const mockRankService = {
        getSuccessRateRank: jest.fn(),
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
    });
});
