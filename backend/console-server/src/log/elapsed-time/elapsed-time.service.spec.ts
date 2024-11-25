import { ElapsedTimeService } from './elapsed-time.service';
import { ElapsedTimeRepository } from './elapsed-time.repository';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '../../project/entities/project.entity';
import { plainToInstance } from 'class-transformer';
import { GetAvgElapsedTimeDto } from './dto/get-avg-elapsed-time.dto';

describe('ElapsedTimeService 테스트', () => {
    let service: ElapsedTimeService;
    let repository: ElapsedTimeRepository;

    const mockElapsedTimeRepository = {
        findAvgElapsedTime: jest.fn(),
        findPathSpeedRankByProject: jest.fn(),
        findSpeedRank: jest.fn(),
        getFastestPathsByDomain: jest.fn(),
        findSlowestPathsByDomain: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ElapsedTimeService,
                {
                    provide: getRepositoryToken(Project),
                    useValue: { findOne: jest.fn() },
                },
                {
                    provide: ElapsedTimeRepository,
                    useValue: mockElapsedTimeRepository,
                },
            ],
        }).compile();

        service = module.get<ElapsedTimeService>(ElapsedTimeService);
        repository = module.get<ElapsedTimeRepository>(ElapsedTimeRepository);

        jest.clearAllMocks();
    });

    it('서비스가 정의될 수 있어야 한다.', () => {
        expect(service).toBeDefined();
    });

    describe('elapsedTime()는 ', () => {
        it('평균 응답 시간을 반환할 수 있어야 한다.', async () => {
            const mockTime = { avg_elapsed_time: 150 };
            mockElapsedTimeRepository.findAvgElapsedTime.mockResolvedValue(mockTime);

            const result = await service.getAvgElapsedTime(
                plainToInstance(GetAvgElapsedTimeDto, { generation: 9 }),
            );

            expect(result).toEqual(mockTime);
            expect(repository.findAvgElapsedTime).toHaveBeenCalled();
        });
    });
});
