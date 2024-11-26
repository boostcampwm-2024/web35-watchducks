import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { RankService } from './rank.service';
import { RankRepository } from './rank.repository';
import { Project } from '../../project/entities/project.entity';
import type { Repository } from 'typeorm';
import type { GetSuccessRateRankDto } from './dto/get-success-rate-rank.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { GetDAURankDto } from './dto/get-dau-rank.dto';

describe('RankService', () => {
    let service: RankService;
    let rankRepository: RankRepository;
    let projectRepository: Repository<Project>;

    const mockRankRepository = {
        findSuccessRateOrderByCount: jest.fn(),
        findDAUOrderByCount: jest.fn(),
    };

    const mockProjectRepository = {
        find: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RankService,
                {
                    provide: RankRepository,
                    useValue: mockRankRepository,
                },
                {
                    provide: getRepositoryToken(Project),
                    useValue: mockProjectRepository,
                },
            ],
        }).compile();

        service = module.get<RankService>(RankService);
        rankRepository = module.get<RankRepository>(RankRepository);
        projectRepository = module.get<Repository<Project>>(getRepositoryToken(Project));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('RankService의', () => {
        describe('getSuccessRateRank()는', () => {
            const mockDto: GetSuccessRateRankDto = {
                generation: 1,
            };

            const mockRankResults = [
                { host: 'test1.com', is_error_rate: 10 },
                { host: 'test2.com', is_error_rate: 20 },
            ];

            const mockProjects = [
                { domain: 'test1.com', name: 'Project 1' },
                { domain: 'test2.com', name: 'Project 2' },
            ];

            it('성공률 순위를 정상적으로 계산하여 반환해야 한다', async () => {
                mockRankRepository.findSuccessRateOrderByCount.mockResolvedValue(mockRankResults);
                mockProjectRepository.find.mockResolvedValue(mockProjects);

                const result = await service.getSuccessRateRank(mockDto);

                expect(result.total).toBe(mockRankResults.length);
                expect(result.rank).toHaveLength(mockRankResults.length);
                expect(result.rank[0].projectName).toBe('Project 1');
                expect(result.rank[0].successRate).toBe(90);
                expect(result.rank[1].projectName).toBe('Project 2');
                expect(result.rank[1].successRate).toBe(80);
            });

            it('프로젝트 정보가 없는 경우 Unknown으로 표시해야 한다', async () => {
                mockRankRepository.findSuccessRateOrderByCount.mockResolvedValue(mockRankResults);
                mockProjectRepository.find.mockResolvedValue([mockProjects[0]]);

                const result = await service.getSuccessRateRank(mockDto);

                expect(result.rank[1].projectName).toBe('Unknown');
            });

            it('rankRepository와 projectRepository를 호출해야 한다', async () => {
                mockRankRepository.findSuccessRateOrderByCount.mockResolvedValue(mockRankResults);
                mockProjectRepository.find.mockResolvedValue(mockProjects);

                await service.getSuccessRateRank(mockDto);

                expect(rankRepository.findSuccessRateOrderByCount).toHaveBeenCalled();
                expect(projectRepository.find).toHaveBeenCalled();
            });
        });

        describe('getDAURank()는', () => {
            const mockDto: GetDAURankDto = {
                generation: 9,
            };
            const yesterday = '2024-11-25';

            const mockRankResults = [
                { host: 'test1.com', dau: 1000 },
                { host: 'test2.com', dau: 500 },
            ];

            const mockProjects = [
                { domain: 'test1.com', name: 'Project 1' },
                { domain: 'test2.com', name: 'Project 2' },
            ];

            beforeEach(() => {
                jest.spyOn(
                    RankService.prototype as unknown as { getYesterdayDate: () => string },
                    'getYesterdayDate',
                ).mockReturnValue(yesterday);
            });

            it('어제 날짜를 기준으로 DAU 순위를 정상적으로 계산하여 반환해야 한다', async () => {
                mockRankRepository.findDAUOrderByCount.mockResolvedValue(mockRankResults);
                mockProjectRepository.find.mockResolvedValue(mockProjects);

                const result = await service.getDAURank(mockDto);

                expect(result.total).toBe(mockRankResults.length);
                expect(result.rank).toHaveLength(mockRankResults.length);
                result.rank.forEach((rankItem, index) => {
                    expect(rankItem.dau).toBe(mockRankResults[index].dau);
                });
            });

            it('rankRepository을 호출해야 한다', async () => {
                mockRankRepository.findDAUOrderByCount.mockResolvedValue(mockRankResults);
                mockProjectRepository.find.mockResolvedValue(mockProjects);

                await service.getDAURank(mockDto);

                expect(rankRepository.findDAUOrderByCount).toHaveBeenCalledWith(yesterday);

                expect(projectRepository.find).toHaveBeenCalled();
                const findCallArg = mockProjectRepository.find.mock.calls[0][0];
                expect(findCallArg.select).toEqual(['domain', 'name']);
                expect(findCallArg.where.domain).toBeDefined();
                expect(findCallArg.where.domain._type).toBe('in');
                expect(findCallArg.where.domain._value).toEqual(['test1.com', 'test2.com']);
            });

            it('DAU 데이터 조회 실패 시 에러를 전파해야 한다', async () => {
                const error = new Error('Failed to fetch DAU data');
                mockRankRepository.findDAUOrderByCount.mockRejectedValue(error);

                await expect(service.getDAURank(mockDto)).rejects.toThrow(error);
            });

            describe('getYesterdayDate()는', () => {
                it('어제 날짜를 YYYY-MM-DD 형식으로 반환해야 한다', () => {
                    const realDate = new Date('2024-11-25');
                    jest.useFakeTimers();
                    jest.setSystemTime(realDate);

                    const result = service['getYesterdayDate']();

                    expect(result).toBe('2024-11-25');

                    jest.useRealTimers();
                });
            });
        });
    });
});
