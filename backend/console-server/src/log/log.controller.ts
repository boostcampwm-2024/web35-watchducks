import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { LogService } from './log.service';

@Controller('log')
export class LogController {
    constructor(private readonly logService: LogService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async httpLog() {
        return await this.logService.httpLog();
    }

    @Get('/elapsed-time')
    @HttpCode(HttpStatus.OK)
    async analyzeElapsedTime() {
        return await this.logService.analyzeElapsedTime();
    }
}
