import { projectQuery } from '../database/query/project.query';
import { DomainNotFoundError } from '../error/domain-not-found.error';
import { ProxyError } from '../error/core/proxy.error';
import { MissingHostHeaderError } from '../error/missing-host-header.error';
import { DatabaseQueryError } from '../error/database-query.error';

export class ProxyService {
    private readonly PROTOCOL = 'http://';

    public async resolveDomain(host: string): Promise<string> {
        try {
            if (host === 'watchducks-test.shop') {
                return '175.106.99.193:3000';
            }
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
