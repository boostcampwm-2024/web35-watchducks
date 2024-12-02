import type { HttpLogType, LogUseCase } from 'domain/port/input/log.use-case';

export class LogAdapter {
    constructor(private readonly logUseCase: LogUseCase) {}

    async saveHttpLog(httpLog: HttpLogType): Promise<void> {
        this.logUseCase.saveHttpLog(httpLog);
    }
}
