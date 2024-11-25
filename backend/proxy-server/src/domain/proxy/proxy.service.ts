import { buildTargetUrl, validateHost, validateIp } from 'server/utils';
import { ProxyError } from 'common/core/proxy.error';
import { DatabaseQueryError } from 'common/error/database-query.error';
import type { ProjectService } from 'domain/project/project.service';

enum Protocol {
    HTTP = 'https://',
    HTTPS = 'https://',
}

export class ProxyService {
    constructor(
        private readonly projectService: ProjectService,
    ) {}

    async resolveTargetUrl(host: string, url: string, protocol: string): Promise<string> {
        const validatedHost = validateHost(host);
        const ip = await this.resolveDomain(validatedHost);
        const targetProtocol = protocol === 'https' ? Protocol.HTTPS : Protocol.HTTP;

        return buildTargetUrl(ip, url, targetProtocol);
    }

    async resolveDomain(host: string): Promise<string> {
        try {
            const ip = await this.projectService.getIpByDomain(host);
            validateIp(ip, host);
            return ip;
        } catch (error) {
            if (error instanceof ProxyError) {
                throw error;
            }
            throw new DatabaseQueryError(error as Error);
        }
    }
}
