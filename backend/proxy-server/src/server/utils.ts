import { DomainNotFoundError } from '../common/error/domain-not-found.error';
import { MissingHostHeaderError } from '../common/error/missing-host-header.error';
import { ProxyError } from '../common/core/proxy.error';

export function validateHost(host: string | undefined): string {
    if (!host) {
        throw new MissingHostHeaderError();
    }
    return host;
}

export function validateIp(ip: string, host: string): void {
    if (!ip) {
        throw new DomainNotFoundError(host);
    }
}

export function buildTargetUrl(ip: string, path: string, protocol: string): string {
    try {
        return `${protocol}${ip}${path || '/'}`;
    } catch (error) {
        throw new ProxyError('대상 URL 생성 중 오류가 발생했습니다.', 500, error as Error);
    }
}
