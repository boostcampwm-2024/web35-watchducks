import type { ExecutionContext } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { CacheTTL } from '@nestjs/cache-manager';
import { CACHE_REFRESH_THRESHOLD_METADATA } from './cache.constant';

const calculateMillisecondsUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return midnight.getTime() - now.getTime();
};

export const CacheTTLUntilMidnight = () => {
    return CacheTTL((_ctx: ExecutionContext) => calculateMillisecondsUntilMidnight());
};

type CacheRefreshThresholdFactory = (ctx: ExecutionContext) => Promise<number> | number;

export const CacheRefreshThreshold = (threshold: number | CacheRefreshThresholdFactory) =>
    SetMetadata(CACHE_REFRESH_THRESHOLD_METADATA, threshold);

export const CacheRefreshAtMidnight = () => {
    return CacheRefreshThreshold((_ctx: ExecutionContext) => calculateMillisecondsUntilMidnight());
};
