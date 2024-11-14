import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { LogService } from './log.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProjectResponseDto } from '../project/dto/create-project-response.dto';

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
    @ApiOperation({
        summary: '기수 총 트래픽 평균 응답시간 API',
        description: '요청받은 기수의 트래픽에 대한 평균 응답시간을 반환합니다.',
    })
    @ApiResponse({
        status: 200,
        description: '평균 응답시간이 성공적으로 반환됨.',
        type: ProjectResponseDto,
    })
    async elapsedTime() {
        return await this.logService.elapsedTime();
    }

    @Get('/traffic/rank')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '기수 내 트래픽 랭킹 TOP 5',
        description: '요청받은 기수의 트래픽 랭킹 TOP 5를 반환합니다.',
    })
    @ApiResponse({
        status: 200,
        description: '트래픽 랭킹 TOP 5가 정상적으로 반환됨.',
        type: ProjectResponseDto,
    })
    async trafficRank() {
        return await this.logService.trafficRank();
    }
}

// 1. 기수 내 전체 프로젝트
// 2. 기수 내 총 트래픽
// 4. 기수 내 응답 성공률
