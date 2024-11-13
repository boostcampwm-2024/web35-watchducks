import type { BaseLog } from '../core/base-log';

interface HttpLog extends BaseLog {
    statusCode: number;
    responseTime: number;
}

export class HttpLogEntity {
    readonly method: string;
    readonly host: string;
    readonly path: string | undefined;
    readonly statusCode: number;
    readonly responseTime: number;

    constructor(log: HttpLog) {
        this.method = log.method;
        this.host = log.host;
        this.path = log.path;
        this.statusCode = log.statusCode;
        this.responseTime = log.responseTime;
    }
}
