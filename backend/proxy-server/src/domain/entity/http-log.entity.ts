interface HttpLog {
    method: string;
    host: string;
    path?: string;
    statusCode: number;
    responseTime: number;
    userIp: string;
}

export class HttpLogEntity {
    readonly method: string;
    readonly host: string;
    readonly path: string | undefined;
    readonly statusCode: number;
    readonly responseTime: number;
    readonly userIp: string;

    constructor(log: HttpLog) {
        this.method = log.method;
        this.host = log.host;
        this.path = log.path;
        this.statusCode = log.statusCode;
        this.responseTime = log.responseTime;
        this.userIp = log.userIp;
    }
}
