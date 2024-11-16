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

    async elapsedTime() {
        const result = await this.logRepository.findAvgElapsedTime();

        console.log(result);

        return result;
    }

    async trafficRank() {
        const result = await this.logRepository.findCountByHost();

        return result.slice(0, 4);
    }

    async responseSuccessRate() {
        const result = await this.logRepository.findResponseSuccessRate();

        return result;
    }

    async trafficByGeneration() {
        const result = await this.logRepository.findTrafficByGeneration();

        return result;
    }
}
