import type { HttpLogEntity } from './http-log.entity';

export interface LogRepository {
    insertHttpLog(log: HttpLogEntity): Promise<void>;
}
