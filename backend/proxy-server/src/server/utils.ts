import { projectQuery } from '../database/query/project.query';
import { DomainNotFoundError } from '../common/error/domain-not-found.error';
import { ProxyError } from '../common/core/proxy.error';
import { MissingHostHeaderError } from '../common/error/missing-host-header.error';
import { DatabaseQueryError } from '../common/error/database-query.error';

export class Utils {
    private readonly PROTOCOL = 'http://';

    public async resolveDomain(host: string): Promise<string> {
        try {
            const ip = await projectQuery.findIpByDomain(host);

            this.validateIp(ip, host);

            return ip;
        } catch (error) {
            if (error instanceof ProxyError) {
                throw error;
            }
            throw new DatabaseQueryError(error as Error);
        }
    }

    public buildTargetUrl(ip: string, path: string): string {
        try {
            return `${this.PROTOCOL}${ip}${path || '/'}`;
        } catch (error) {
            throw new ProxyError('대상 URL 생성 중 오류가 발생했습니다.', 500, error as Error);
        }
    }

    public validateHost(host: string | undefined): string {
        if (!host) {
            throw new MissingHostHeaderError();
        }
        return host;
    }

    private validateIp(ip: string, host: string): void {
        if (!ip) {
            throw new DomainNotFoundError(host);
        }
    }
}
