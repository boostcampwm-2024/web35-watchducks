import type { Logger } from './logger';
import type { RemoteInfo } from 'dgram';

export class ConsoleLogger implements Logger {
    async info(message: string): Promise<void> {
        console.log(message);
    }

    async error(message: string, error: Error): Promise<void> {
        console.error(message, error);
    }

    async logQuery(domain: string, remoteInfo: RemoteInfo): Promise<void> {
        console.log(`Received query for ${domain} from ${remoteInfo.address}:${remoteInfo.port}`);
    }
}
