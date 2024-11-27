import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    Logger,
    NestInterceptor,
    Optional,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, CACHE_KEY_METADATA, CACHE_TTL_METADATA } from '@nestjs/cache-manager';
import { Reflector, HttpAdapterHost } from '@nestjs/core';
import { firstValueFrom } from 'rxjs';
import { CACHE_REFRESH_THRESHOLD_METADATA } from './cache.constant';
import { isNil } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class CustomCacheInterceptor<T> implements NestInterceptor<T, T> {
    @Optional()
    @Inject()
    protected readonly httpAdapterHost: HttpAdapterHost;

    protected allowedMethods = ['GET'];

    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly reflector: Reflector,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler<T>): Promise<Observable<T>> {
        const cacheKey = this.trackBy(context);

        const ttlValueOrFactory =
            this.reflector.get(CACHE_TTL_METADATA, context.getHandler()) ??
            this.reflector.get(CACHE_TTL_METADATA, context.getClass()) ??
            null;

        const refreshThresholdValueOrFactory =
            this.reflector.get(CACHE_REFRESH_THRESHOLD_METADATA, context.getHandler()) ??
            this.reflector.get(CACHE_REFRESH_THRESHOLD_METADATA, context.getClass()) ??
            null;

        if (!cacheKey) return next.handle();

        try {
            const ttl =
                typeof ttlValueOrFactory === 'function'
                    ? await ttlValueOrFactory(context)
                    : ttlValueOrFactory;

            const refreshThreshold =
                typeof refreshThresholdValueOrFactory === 'function'
                    ? await refreshThresholdValueOrFactory(context)
                    : refreshThresholdValueOrFactory;

            const args: [string, () => Promise<T>, number?, number?] = [
                cacheKey,
                () => firstValueFrom(next.handle()),
            ];
            if (!isNil(ttl)) args.push(ttl);
            if (!isNil(refreshThreshold)) args.push(refreshThreshold);

            const cachedResponse = await this.cacheManager.wrap<T>(...args);

            this.setHeadersWhenHttp(context, cachedResponse);

            return of(cachedResponse);
        } catch (err) {
            Logger.error(
                `CacheInterceptor Error: ${err.message}`,
                err.stack,
                'CustomCacheInterceptor',
            );
            return next.handle();
        }
    }

    protected trackBy(context: ExecutionContext): string | undefined {
        const httpAdapter = this.httpAdapterHost.httpAdapter;
        const isHttpApp = httpAdapter && !!httpAdapter.getRequestMethod;
        const cacheMetadata = this.reflector.get(CACHE_KEY_METADATA, context.getHandler());

        if (!isHttpApp || cacheMetadata) {
            return cacheMetadata;
        }

        const request = context.getArgByIndex(0);
        if (!this.isRequestCacheable(context)) {
            return undefined;
        }
        return httpAdapter.getRequestUrl(request);
    }

    protected isRequestCacheable(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        return this.allowedMethods.includes(req.method);
    }

    protected setHeadersWhenHttp(context: ExecutionContext, value: unknown): void {
        if (!this.httpAdapterHost) {
            return;
        }
        const { httpAdapter } = this.httpAdapterHost;
        if (!httpAdapter) {
            return;
        }
        const response = context.switchToHttp().getResponse();
        httpAdapter.setHeader(response, 'X-Cache', !isNil(value) ? 'HIT' : 'MISS');
    }
}
