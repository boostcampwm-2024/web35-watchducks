import { SuccessRateRepository } from './success-rate.repository';
import { Clickhouse } from '../../clickhouse/clickhouse';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

describe('SuccessRateRepository 테스트', () => {
    let repository: SuccessRateRepository;
    let clickhouse: Clickhouse;

    const mockClickhouse = {
        query: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SuccessRateRepository,
                {
                    provide: Clickhouse,
                    useValue: mockClickhouse,
                },
            ],
        }).compile();

        repository = module.get<SuccessRateRepository>(SuccessRateRepository);
        clickhouse = module.get<Clickhouse>(Clickhouse);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('레퍼지토리가 정의될 수 있어야 한다.', () => {
        expect(repository).toBeDefined();
    });

    describe('findSuccessRate()는 ', () => {
        it('성공률을 올바르게 계산할 수 있어야 한다.', async () => {
            const mockQueryResult = [{ is_error_rate: 1.5 }];
            (clickhouse.query as jest.Mock).mockResolvedValue(mockQueryResult);

            const result = await repository.findSuccessRate();

            expect(result).toEqual({ success_rate: 98.5 });
            expect(clickhouse.query).toHaveBeenCalledWith(
                'SELECT (sum(is_error) / count(*)) * 100 as is_error_rate\nFROM http_log',
            );
        });

        it('에러율이 0%일 때 성공률 100%를 반환해야 한다.', async () => {
            mockClickhouse.query.mockResolvedValue([{ is_error_rate: 0 }]);

            const result = await repository.findSuccessRate();

            expect(result).toEqual({ success_rate: 100 });
        });
    });

    describe('findSuccessRateByProject()는 ', () => {
        const domain = 'example.com';

        it('프로젝트별 성공률을 올바르게 계산할 수 있어야 한다', async () => {
            const mockQueryResult = [{ is_error_rate: 1.5 }];
            (clickhouse.query as jest.Mock).mockResolvedValue(mockQueryResult);

            const result = await repository.findSuccessRateByProject(domain);

            const expectedQuery = `SELECT (sum(is_error) / count(*)) * 100 as is_error_rate
FROM (SELECT is_error, timestamp
FROM http_log WHERE host = {host:String} ORDER BY timestamp DESC LIMIT 1000) as subquery`;

            expect(result).toEqual({ success_rate: 98.5 });
            expect(clickhouse.query).toHaveBeenCalledWith(expectedQuery, { host: domain });
        });

        it('에러율이 0%일 때 성공률 100%를 반환해야 한다', async () => {
            (clickhouse.query as jest.Mock).mockResolvedValue([{ is_error_rate: 0 }]);

            const result = await repository.findSuccessRateByProject(domain);

            expect(result).toEqual({ success_rate: 100 });
        });

        it('쿼리 에러 발생시 예외를 throw 해야 한다', async () => {
            const error = new Error('Clickhouse connection error');
            (clickhouse.query as jest.Mock).mockRejectedValue(error);

            await expect(repository.findSuccessRateByProject(domain)).rejects.toThrow(
                'Clickhouse connection error',
            );
        });
    });
});
