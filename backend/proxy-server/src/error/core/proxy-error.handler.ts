import type { FastifyRequest } from 'fastify';
import type { FastifyLogger } from '../../common/logger/fastify.logger';
import type { ErrorLog } from '../../common/interface/log.interface';
import { ProxyError } from './proxy.error';
import { isProxyError } from './proxy-error.type.guard';
import type { IncomingHttpHeaders } from 'node:http';
import { LogService } from '../../service/log.service';

interface ProxyErrorHandlerOptions {
    logger: FastifyLogger;
}

export class ProxyErrorHandler {
    private readonly logger: FastifyLogger;
    private readonly logService: LogService;

    constructor(options: ProxyErrorHandlerOptions) {
        this.logger = options.logger;
        this.logService = new LogService();
    }

    createErrorLog(message: string, request: FastifyRequest, error: Error): ErrorLog {
        const proxyError = this.ensureProxyError(error);

        return {
            method: request.method,
            host: request.host,
            path: request.raw.url ?? '',
            request: this.createRequestContext(request),
            error: this.createErrorContext(proxyError),
        };
    }

    handleError(error: Error, request: FastifyRequest): ProxyError {
        const proxyError = this.ensureProxyError(error);
        const errorLog = this.createErrorLog('Error occurred', request, proxyError);

        this.logger.error(errorLog);
        this.logService.saveErrorLog(errorLog);
        return proxyError;
    }

    private ensureProxyError(error: Error): ProxyError {
        if (isProxyError(error)) {
            return error;
        }
        return new ProxyError('예기치 않은 오류가 발생했습니다.', 500, error);
    }

    private createRequestContext(request: FastifyRequest) {
        return {
            method: request.method,
            host: request.host,
            url: request.url,
            path: request.raw.url ?? '',
            headers: this.extractRelevantHeaders(request.headers),
        };
    }

    private extractRelevantHeaders(headers: IncomingHttpHeaders) {
        return {
            'user-agent': this.getHeaderValue(headers['user-agent']),
            'content-type': this.getHeaderValue(headers['content-type']),
            'x-forwarded-for': this.getHeaderValue(headers['x-forwarded-for']),
        };
    }

    private getHeaderValue(header: string | string[] | undefined): string | undefined {
        if (Array.isArray(header)) {
            return header[0];
        }
        return header;
    }

    private createErrorContext(error: ProxyError) {
        return {
            message: error.message,
            name: error.name,
            stack: error.stack,
            originalError: error.originalError,
        };
    }
}
