import { Controller, Get, HttpCode, HttpStatus, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetAvgElapsedTimeResponseDto } from './dto/get-avg-elapsed-time-response.dto';
import { GetAvgElapsedTimeDto } from './dto/get-avg-elapsed-time.dto';
import { ElapsedTimeService } from './elapsed-time.service';
import { GetTop5ElapsedTime } from './dto/get-top5-elapsed.time';
import { GetTop5ElapsedTimeDto } from './dto/get-top5-elapsed-time.dto';
import { GetPathElapsedTimeResponseDto } from './dto/get-path-elapsed-time-response.dto';
import { GetPathElapsedTimeRank } from './dto/get-path-elapsed-time.rank';
import { CustomCacheInterceptor } from '../../common/cache/cache-wrap.interceptor';
import { CacheTTL } from '@nestjs/cache-manager';
import { CacheRefreshThreshold } from '../../common/cache/cache-wrap.decorator';

@Controller('log/elapsed-time')
@UseInterceptors(CustomCacheInterceptor)
export class ElapsedTimeController {
    constructor(private readonly elapsedTimeService: ElapsedTimeService) {}

    @CacheTTL(30 * 1000)
    @CacheRefreshThreshold(15 * 1000)
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '기수 총 트래픽 평균 응답시간 API',
        description: '요청받은 기수의 트래픽에 대한 평균 응답시간을 반환합니다.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '평균 응답시간이 성공적으로 반환됨.',
        type: GetAvgElapsedTimeResponseDto,
    })
    async getElapsedTime(@Query() getAvgElapsedTimeDto: GetAvgElapsedTimeDto) {
        return await this.elapsedTimeService.getAvgElapsedTime(getAvgElapsedTimeDto);
    }

    @Get('/top5')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '기수 내 응답 속도 TOP5',
        description: '요청받은 기수의 응답 속도 랭킹 TOP 5를 반환합니다.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '응답 속도 랭킹 TOP5가 정상적으로 반환됨.',
        type: GetTop5ElapsedTime,
    })
    async getTop5ElapsedTime(@Query() getSpeedRankDto: GetTop5ElapsedTimeDto) {
        return await this.elapsedTimeService.getTop5ElapsedTime(getSpeedRankDto);
    }

    @Get('/path-rank')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '개별 프로젝트의 경로별 응답 속도 순위',
        description:
            '개별 프로젝트의 경로별 응답 속도 중 가장 빠른/느린 3개를 반환합니다. 빠른 응답은 유효한(상태 코드 200번대)만을 포함합니다.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '개별 프로젝트의 경로별 응답 속도 중 가장 빠른/느린 3개가 반환됨.',
        type: GetPathElapsedTimeResponseDto,
    })
    async getPathElapsedTimeRank(@Query() getPathElapsedTimeRank: GetPathElapsedTimeRank) {
        return await this.elapsedTimeService.getPathElapsedTimeRank(getPathElapsedTimeRank);
    }
}
