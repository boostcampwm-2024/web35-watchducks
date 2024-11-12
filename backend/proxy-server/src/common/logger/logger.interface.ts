import type { ErrorLog } from '../../domain/log/log.interface';
import { RequestLogEntity } from '../../domain/log/request-log.entity';
import { ResponseLogEntity } from '../../domain/log/response-log.entity';

export interface Logger {
    info(log: RequestLogEntity | ResponseLogEntity | { message: string }): void;
    error(log: ErrorLog): void;
}
