import type { ProjectRepository } from 'domain/port/output/project.repository';
import { buildTargetUrl, validateHost, validateIp } from 'domain/utils';
import { ProxyError } from 'common/core/proxy.error';
import { DatabaseQueryError } from 'common/error/database-query.error';
import type { ProjectCacheRepository } from 'domain/port/output/project-cache.repository';
import type { ProjectUseCase } from 'domain/port/input/project.use-case';

enum Protocol {
    HTTP = 'https://',
    // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
    HTTPS = 'https://',
}

export class ProjectService implements ProjectUseCase {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly projectCacheRepository: ProjectCacheRepository,
    ) {}

    async resolveTargetUrl(host: string, url: string, protocol: string): Promise<string> {
        const validatedHost = validateHost(host);
        const ip = await this.resolveDomain(validatedHost);
        const targetProtocol = protocol === 'https' ? Protocol.HTTPS : Protocol.HTTP;

        return buildTargetUrl(ip, url, targetProtocol);
    }

    private async resolveDomain(host: string): Promise<string> {
        try {
            const cachedIp = await this.projectCacheRepository.findIpByDomain(host);

            if (cachedIp) {
                return cachedIp;
            }
            const ip = await this.projectRepository.findIpByDomain(host);

            validateIp(host, ip);
            this.projectCacheRepository.cacheIpByDomain(host, ip);

            return ip;
        } catch (error) {
            if (error instanceof ProxyError) {
                throw error;
            }
            throw new DatabaseQueryError(error as Error);
        }
    }
}
