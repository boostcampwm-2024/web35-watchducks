export type HttpLogType = {
    method: string;
    host: string;
    path: string | undefined;
    statusCode: number;
    responseTime: number;
    userIp: string;
};

export interface LogUseCase {
    saveHttpLog(log: HttpLogType): Promise<void>;
}
