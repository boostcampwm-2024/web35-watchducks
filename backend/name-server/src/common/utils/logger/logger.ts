import type { RemoteInfo } from 'dgram';

export interface Logger {
    info(message: string): Promise<void>;
    error(message: string, error: Error): Promise<void>;
    logQuery(domain: string, remoteInfo: RemoteInfo): Promise<void>;
}
