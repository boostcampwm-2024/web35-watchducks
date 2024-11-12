import type { RequestLogEntity } from './request-log.entity';
import type { ResponseLogEntity } from './response-log.entity';

export interface LogRepository {
    insertRequestLog(log: RequestLogEntity): Promise<void>;
    insertResponseLog(log: ResponseLogEntity): Promise<void>;
}
