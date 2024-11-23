import { ElapsedTimeRepository } from './elapsed-time.repository';
import { Clickhouse } from '../../clickhouse/clickhouse';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

describe('ElapsedTimeRepository 테스트', () => {
    let repository: ElapsedTimeRepository;
    let clickhouse: Clickhouse;

    const mockClickhouse = {
        query: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ElapsedTimeRepository,
                {
                    provide: Clickhouse,
                    useValue: mockClickhouse,
                },
            ],
        }).compile();

        repository = module.get<ElapsedTimeRepository>(ElapsedTimeRepository);
        clickhouse = module.get<Clickhouse>(Clickhouse);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('레퍼지토리가 정의될 수 있어야 한다.', () => {
        expect(repository).toBeDefined();
    });

    describe('findAvgElapsedTime()는 ', () => {
        it('TimeSeriesQueryBuilder를 사용하여 올바른 쿼리를 생성해야 한다.', async () => {
            const mockResult = [{ avg_elapsed_time: 150 }];
            mockClickhouse.query.mockResolvedValue(mockResult);

            const result = await repository.findAvgElapsedTime();

            expect(result).toEqual(mockResult[0]);
            expect(clickhouse.query).toHaveBeenCalledWith(
                expect.stringMatching(/SELECT.*avg\(elapsed_time\)/),
                expect.any(Object),
            );
        });
    });
});
