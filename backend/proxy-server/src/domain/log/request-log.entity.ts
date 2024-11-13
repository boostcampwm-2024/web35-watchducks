import { BaseLog } from '../core/base-log';

interface RequestLog extends BaseLog {}

export class RequestLogEntity {
    readonly method: string;
    readonly host: string;
    readonly path: string | undefined;

    constructor(log: RequestLog) {
        this.method = log.method;
        this.host = log.host;
        this.path = log.path;
    }
}
