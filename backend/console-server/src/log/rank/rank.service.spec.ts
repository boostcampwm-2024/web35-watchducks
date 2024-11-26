import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { RankService } from './rank.service';
import { RankRepository } from './rank.repository';
import { Project } from '../../project/entities/project.entity';
import type { Repository } from 'typeorm';
import type { GetSuccessRateRankDto } from './dto/get-success-rate-rank.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { GetElapsedTimeRankDto } from './dto/get-elapsed-time-rank.dto';

describe('RankService', () => {
    let service: RankService;
    let rankRepository: RankRepository;
    let projectRepository: Repository<Project>;

    const mockRankRepository = {
        findSuccessRateOrderByCount: jest.fn(),
        findHostOrderByElapsedTimeSince: jest.fn(),
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

        describe('getElapsedTimeRank()는', () => {
            const mockDto: GetElapsedTimeRankDto = {
                generation: 1,
            };

            const mockRankResults = [
                { host: 'test1.com', avg_elapsed_time: 100 },
                { host: 'test2.com', avg_elapsed_time: 150 },
            ];

            const mockProjects = [
                { domain: 'test1.com', name: 'Project 1' },
                { domain: 'test2.com', name: 'Project 2' },
            ];

            it('응답 소요 시간 순위를 정상적으로 계산하여 반환해야 한다', async () => {
                mockRankRepository.findHostOrderByElapsedTimeSince.mockResolvedValue(
                    mockRankResults,
                );
                mockProjectRepository.find.mockResolvedValue(mockProjects);

                const result = await service.getElapsedTimeRank(mockDto);

                expect(result.total).toBe(mockRankResults.length);
                expect(result.rank).toHaveLength(mockRankResults.length);
                expect(result.rank[0].projectName).toBe('Project 1');
                expect(result.rank[0].elapsedTime).toBe(100);
                expect(result.rank[1].projectName).toBe('Project 2');
                expect(result.rank[1].elapsedTime).toBe(150);
            });

            it('프로젝트 정보가 없는 경우 Unknown으로 표시해야 한다', async () => {
                mockRankRepository.findHostOrderByElapsedTimeSince.mockResolvedValue(
                    mockRankResults,
                );
                mockProjectRepository.find.mockResolvedValue([mockProjects[0]]);

                const result = await service.getElapsedTimeRank(mockDto);

                expect(result.rank[1].projectName).toBe('Unknown');
            });

            it('rankRepository와 projectRepository를 호출해야 한다', async () => {
                mockRankRepository.findHostOrderByElapsedTimeSince.mockResolvedValue(
                    mockRankResults,
                );
                mockProjectRepository.find.mockResolvedValue(mockProjects);

                await service.getElapsedTimeRank(mockDto);

                expect(rankRepository.findHostOrderByElapsedTimeSince).toHaveBeenCalled();
                expect(projectRepository.find).toHaveBeenCalled();
            });
        });
    });
});
