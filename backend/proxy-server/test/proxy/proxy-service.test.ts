import { ProxyService } from '../../src/proxy/proxy-service';
import { projectQuery } from '../../src/database/query/project.query';
import { DomainNotFoundError } from '../../src/error/domain-not-found.error';
import { MissingHostHeaderError } from '../../src/error/missing-host-header.error';
import { DatabaseQueryError } from '../../src/error/database-query.error';
import { ProxyError } from '../../src/error/core/proxy.error';

jest.mock('../../src/database/query/project.query');

describe('proxy-service 테스트', () => {
    let proxyService: ProxyService;

    beforeEach(() => {
        proxyService = new ProxyService();
        jest.clearAllMocks();
    });

    describe('resolveDomain()은 ', () => {
        it('도메인을 ip로 성공적으로 확인해야 한다.', async () => {
            const mockHost = 'api.example.com';
            const mockIp = '10.0.0.1';

            (projectQuery.findIpByDomain as jest.Mock).mockResolvedValue(mockIp);

            const result = await proxyService.resolveDomain(mockHost);

            expect(result).toBe(mockIp);
            expect(projectQuery.findIpByDomain).toHaveBeenCalledWith(mockHost);
        });

        it('ip를 찾을 수 없는 경우에는 DomainNotFoundError를 던져야 한다.', async () => {
            const mockHost = 'nonexistent-api.example.com';

            (projectQuery.findIpByDomain as jest.Mock).mockResolvedValue('');

            await expect(proxyService.resolveDomain(mockHost)).rejects.toThrow(DomainNotFoundError);
        });

        it('데이터베이스 쿼리가 실패하면 DatabaseQueryError를 던져야 한다.', async () => {
            const mockHost = 'api.example.com';
            const mockError = new Error('Database connection failed');

            (projectQuery.findIpByDomain as jest.Mock).mockRejectedValue(mockError);

            await expect(proxyService.resolveDomain(mockHost)).rejects.toThrow(DatabaseQueryError);
        });
    });

    describe('buildTargetUrl()은 ', () => {
        it('path를 포함한 URL을 올바르게 생성해야 한다.', () => {
            const ip = '10.0.0.1';
            const path = '/api/v1/users';

            const result = proxyService.buildTargetUrl(ip, path);

            expect(result).toBe('http://10.0.0.1/api/v1/users');
        });

        it('빈 경로가 주어졌을 때 URL을 올바르게 생성해야 한다.', () => {
            const ip = '10.0.0.1';
            const path = '';

            const result = proxyService.buildTargetUrl(ip, path);

            expect(result).toBe('http://10.0.0.1/');
        });

        it('URL 생성 중 오류가 발생하면 ProxyError를 throw해야 한다.', () => {
            const badIp = {
                toString: () => {
                    throw new Error('IP 주소 변환 중 오류 발생');
                },
            };

            expect(() => {
                proxyService.buildTargetUrl(badIp as unknown as string, '/test');
            }).toThrow(ProxyError);
        });
    });

    describe('validateHost()은 ', () => {
        it('유효한 호스트가 주어졌을 때 해당 호스트를 반환해야 한다.', () => {
            const mockHost = 'api.example.com';

            const result = proxyService.validateHost(mockHost);

            expect(result).toBe(mockHost);
        });

        it('호스트가 undefined일 때 MissingHostHeaderError 예외를 던져야 한다', () => {
            expect(() => proxyService.validateHost(undefined)).toThrow(MissingHostHeaderError);
        });

        it('호스트가 빈 문자열일 때 MissingHostHeaderError 예외를 던져야 한다.', () => {
            expect(() => proxyService.validateHost('')).toThrow(MissingHostHeaderError);
        });
    });
});
