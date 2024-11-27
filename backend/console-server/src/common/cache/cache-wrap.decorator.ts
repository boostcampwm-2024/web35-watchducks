import type { ExecutionContext } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';

export const CACHE_REFRESH_THRESHOLD_METADATA = 'CACHE_REFRESH_THRESHOLD';

type CacheRefreshThresholdFactory = (ctx: ExecutionContext) => Promise<number> | number;
export const CacheRefreshThreshold = (threshold: number | CacheRefreshThresholdFactory) =>
    SetMetadata(CACHE_REFRESH_THRESHOLD_METADATA, threshold);
