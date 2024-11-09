import { ProxyError } from './core/proxy.error';

export class DomainNotFoundError extends ProxyError {
    constructor(domain: string, originalError?: Error) {
        super(`도메인 ${domain}에 대한 IP를 찾을 수 없습니다.`, 404, originalError);
        this.name = 'DomainNotFoundError';
    }
}
