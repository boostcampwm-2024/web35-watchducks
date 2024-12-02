import 'reflect-metadata';
import { ProjectService } from './project.service';
import type { ProjectRepository } from '../port/output/project.repository';
import type { ProjectCacheRepository } from '../port/output/project-cache.repository';
import { ProxyError } from 'common/core/proxy.error';
import { DatabaseQueryError } from 'common/error/database-query.error';
import { MissingHostHeaderError } from 'common/error/missing-host-header.error';
import { DomainNotFoundError } from 'common/error/domain-not-found.error';

describe('ProjectService', () => {
    let projectService: ProjectService;
    let mockProjectRepository: jest.Mocked<ProjectRepository>;
    let mockProjectCacheRepository: jest.Mocked<ProjectCacheRepository>;

    beforeEach(() => {
        mockProjectRepository = {
            findIpByDomain: jest.fn(),
        } as jest.Mocked<ProjectRepository>;

        mockProjectCacheRepository = {
            findIpByDomain: jest.fn(),
            cacheIpByDomain: jest.fn(),
        } as jest.Mocked<ProjectCacheRepository>;

        projectService = new ProjectService(mockProjectRepository, mockProjectCacheRepository);
    });

    describe('resolveTargetUrl 는', () => {
        const validHost = 'example.com';
        const validUrl = '/api/test';
        const validIp = '192.168.1.1';

        it('HTTP 프로토콜로 대상 URL을 올바르게 생성해야 한다', async () => {
            mockProjectCacheRepository.findIpByDomain.mockResolvedValue(validIp);

            const result = await projectService.resolveTargetUrl(validHost, validUrl, 'http');

            expect(result).toBe(`https://${validIp}${validUrl}`);
        });

        it('HTTPS 프로토콜로 대상 URL을 올바르게 생성해야 한다', async () => {
            mockProjectCacheRepository.findIpByDomain.mockResolvedValue(validIp);

            const result = await projectService.resolveTargetUrl(validHost, validUrl, 'https');

            expect(result).toBe(`https://${validIp}${validUrl}`);
        });

        it('host가 없으면 MissingHostHeaderError를 던져야 한다', async () => {
            await expect(projectService.resolveTargetUrl('', validUrl, 'http')).rejects.toThrow(
                MissingHostHeaderError,
            );
        });
    });

    describe('resolveDomain 은', () => {
        const validHost = 'example.com';
        const validIp = '192.168.1.1';

        it('캐시에서 IP를 찾으면 해당 IP를 반환해야 한다', async () => {
            mockProjectCacheRepository.findIpByDomain.mockResolvedValue(validIp);

            const result = await projectService['resolveDomain'](validHost);

            expect(result).toBe(validIp);
            expect(mockProjectCacheRepository.findIpByDomain).toHaveBeenCalledWith(validHost);
            expect(mockProjectRepository.findIpByDomain).not.toHaveBeenCalled();
        });

        it('캐시에 IP가 없으면 repository에서 조회하고 캐시해야 한다', async () => {
            mockProjectCacheRepository.findIpByDomain.mockResolvedValue(null);
            mockProjectRepository.findIpByDomain.mockResolvedValue(validIp);

            const result = await projectService['resolveDomain'](validHost);

            expect(result).toBe(validIp);
            expect(mockProjectCacheRepository.findIpByDomain).toHaveBeenCalledWith(validHost);
            expect(mockProjectRepository.findIpByDomain).toHaveBeenCalledWith(validHost);
            expect(mockProjectCacheRepository.cacheIpByDomain).toHaveBeenCalledWith(
                validHost,
                validIp,
            );
        });

        it('IP가 없으면 DomainNotFoundError를 던져야 한다', async () => {
            // Arrange
            mockProjectCacheRepository.findIpByDomain.mockResolvedValue(null);
            mockProjectRepository.findIpByDomain.mockResolvedValue('');

            await expect(projectService['resolveDomain'](validHost)).rejects.toThrow(
                DomainNotFoundError,
            );
        });

        it('데이터베이스 오류 발생 시 DatabaseQueryError를 던져야 한다', async () => {
            mockProjectCacheRepository.findIpByDomain.mockResolvedValue(null);
            mockProjectRepository.findIpByDomain.mockRejectedValue(new Error('DB Error'));

            await expect(projectService['resolveDomain'](validHost)).rejects.toThrow(
                DatabaseQueryError,
            );
        });

        it('ProxyError는 그대로 전파되어야 한다', async () => {
            const proxyError = new ProxyError('Proxy Error', 500);
            mockProjectCacheRepository.findIpByDomain.mockRejectedValue(proxyError);

            await expect(projectService['resolveDomain'](validHost)).rejects.toThrow(proxyError);
        });
    });
});
