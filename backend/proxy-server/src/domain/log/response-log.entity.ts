import { BaseLog } from '../core/base-log';

interface ResponseLog extends BaseLog {
    statusCode: number;
    responseTime: number;
}

export class ResponseLogEntity {
    readonly method: string;
    readonly host: string;
    readonly path: string | undefined;
    readonly statusCode: number;
    readonly responseTime: number;

    constructor(log: ResponseLog) {
        this.method = log.method;
        this.host = log.host;
        this.path = log.path;
        this.statusCode = log.statusCode;
        this.responseTime = log.responseTime;
    }
}
