import type { ErrorLog, ResponseLog } from '../interface/log.interface';
import type { RequestLog } from '../interface/log.interface';

export interface Logger {
    info(log: RequestLog | ResponseLog | { message: string }): void;
    error(log: ErrorLog): void;
}
