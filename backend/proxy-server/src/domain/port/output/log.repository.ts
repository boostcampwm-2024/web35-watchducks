import type { HttpLogEntity } from 'domain/entity/http-log.entity';

export interface LogRepository {
    insertHttpLog(log: HttpLogEntity): Promise<void>;
}
