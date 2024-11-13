import { Injectable } from '@nestjs/common';
import { LogRepository } from './log.repository';

@Injectable()
export class LogService {
    constructor(private readonly logRepository: LogRepository) {}

    async httpLog() {
        const result = await this.logRepository.findHttpLog();

        console.log(result);

        return result;
    }
}
