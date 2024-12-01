// import type { FastifyRequest } from 'fastify';
// import { ProxyError } from 'common/core/proxy.error';
// import { isProxyError } from 'common/core/proxy-error.type.guard';
// import type { IncomingHttpHeaders } from 'node:http';
// import type { ErrorLogRepository } from 'common/logger/error-log.repository';
// import type { ErrorLog } from 'common/logger/logger.interface';
//
// interface ProxyErrorHandlerOptions {
//     logger: FastifyLogger;
// }
//
// export class ErrorHandler {
//     private readonly logger: FastifyLogger;
//
//     constructor(
//         options: ProxyErrorHandlerOptions,
//         private readonly errorLogRepository: ErrorLogRepository,
//     ) {
//         this.logger = options.logger;
//     }
//
//     handleError(error: Error, request: FastifyRequest): ProxyError {
//         const proxyError = this.ensureProxyError(error);
//         const errorLog = this.createErrorLog('Error occurred', request, proxyError);
//
//         this.logger.error(errorLog);
//         this.errorLogRepository.saveErrorLog(errorLog);
//         return proxyError;
//     }
//
//     private ensureProxyError(error: Error): ProxyError {
//         if (isProxyError(error)) {
//             return error;
//         }
//         return new ProxyError('예기치 않은 오류가 발생했습니다.', 500, error);
//     }
//
//     private createErrorLog(message: string, request: FastifyRequest, error: Error): ErrorLog {
//         const proxyError = this.ensureProxyError(error);
//
//         return {
//             method: request.method,
//             host: request.host,
//             path: request.raw.url ?? '',
//             request: this.createRequestContext(request),
//             error: this.createErrorContext(proxyError),
//         };
//     }
//
//     private createRequestContext(request: FastifyRequest) {
//         return {
//             method: request.method,
//             host: request.host,
//             url: request.url,
//             path: request.raw.url ?? '',
//             headers: this.extractRelevantHeaders(request.headers),
//         };
//     }
//
//     private extractRelevantHeaders(headers: IncomingHttpHeaders) {
//         return {
//             'user-agent': this.getHeaderValue(headers['user-agent']),
//             'content-type': this.getHeaderValue(headers['content-type']),
//             'x-forwarded-for': this.getHeaderValue(headers['x-forwarded-for']),
//         };
//     }
//
//     private getHeaderValue(header: string | string[] | undefined): string | undefined {
//         if (Array.isArray(header)) {
//             return header[0];
//         }
//         return header;
//     }
//
//     private createErrorContext(error: ProxyError) {
//         return {
//             message: error.message,
//             name: error.name,
//             stack: error.stack,
//             originalError: error.originalError,
//         };
//     }
// }
