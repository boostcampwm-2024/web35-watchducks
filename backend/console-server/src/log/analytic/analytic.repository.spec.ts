import { Clickhouse } from '../../clickhouse/clickhouse';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { AnalyticRepository } from './analytic.repository';

describe('AnalyticRepository 테스트', () => {
    let repository: AnalyticRepository;
    let clickhouse: Clickhouse;

    const mockClickhouse = {
        query: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AnalyticRepository,
                {
                    provide: Clickhouse,
                    useValue: mockClickhouse,
                },
            ],
        }).compile();

        repository = module.get<AnalyticRepository>(AnalyticRepository);
        clickhouse = module.get<Clickhouse>(Clickhouse);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('레퍼지토리가 정의될 수 있어야 한다.', () => {
        expect(repository).toBeDefined();
    });

    describe('getDAUByProject()', () => {
        const domain = 'example.com';
        const date = '2024-11-18';

        it('존재하는 도메인과 날짜가 들어오면 존재하는 DAU 값을 반환해야 한다.', async () => {
            const mockResult = [{ dau: 150 }];
            mockClickhouse.query.mockResolvedValue(mockResult);

            const result = await repository.findDAUByProject(domain, date);

            expect(result).toBe(150);
            expect(clickhouse.query).toHaveBeenCalledWith(
                expect.stringMatching(
                    /SELECT.*SUM\(access\).*as dau.*FROM dau.*WHERE.*domain = \{domain:String}.*AND.*date = \{date:String}/s,
                ),
                expect.objectContaining({ domain, date }),
            );
        });

        it('DAU 데이터가 없을 경우 0을 반환해야 한다.', async () => {
            mockClickhouse.query.mockResolvedValue([]);

            const result = await repository.findDAUByProject(domain, date);

            expect(result).toBe(0);
            expect(clickhouse.query).toHaveBeenCalledWith(
                expect.stringMatching(
                    /SELECT.*SUM\(access\).*as dau.*FROM dau.*WHERE.*domain = \{domain:String}.*AND.*date = \{date:String}/s,
                ),
                expect.objectContaining({ domain, date }),
            );
        });

        it('DAU 값이 null일 경우 0을 반환해야 한다.', async () => {
            const mockResult = [{ dau: null }];
            mockClickhouse.query.mockResolvedValue(mockResult);

            const result = await repository.findDAUByProject(domain, date);

            expect(result).toBe(0);
            expect(clickhouse.query).toHaveBeenCalledWith(
                expect.stringMatching(
                    /SELECT.*SUM\(access\).*as dau.*FROM dau.*WHERE.*domain = \{domain:String}.*AND.*date = \{date:String}/s,
                ),
                expect.objectContaining({ domain, date }),
            );
        });

        it('Clickhouse 호출 중 에러가 발생하면 예외를 throw 해야 한다.', async () => {
            const error = new Error('Clickhouse query failed');
            mockClickhouse.query.mockRejectedValue(error);

            await expect(repository.findDAUByProject(domain, date)).rejects.toThrow(
                'Clickhouse query failed',
            );

            expect(clickhouse.query).toHaveBeenCalledWith(
                expect.stringMatching(
                    /SELECT.*SUM\(access\).*as dau.*FROM dau.*WHERE.*domain = \{domain:String}.*AND.*date = \{date:String}/s,
                ),
                expect.objectContaining({ domain, date }),
            );
        });
    });
});
