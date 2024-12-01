import type { HttpLogEntity } from '../../vo/http-log.entity';

export interface LogRepository {
    insertHttpLog(log: HttpLogEntity): Promise<void>;
}
