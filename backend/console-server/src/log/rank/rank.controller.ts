import { RankService } from './rank.service';
import { Controller, Get, HttpCode, HttpStatus, Query, UseInterceptors } from '@nestjs/common';
import { GetSuccessRateRankResponseDto } from './dto/get-success-rate-rank-response.dto';
import { GetSuccessRateRankDto } from './dto/get-success-rate-rank.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetElapsedTimeRankResponseDto } from './dto/get-elapsed-time-rank-response.dto';
import { GetElapsedTimeRankDto } from './dto/get-elapsed-time-rank.dto';
import { GetDAURankDto } from './dto/get-dau-rank.dto';
import { GetDAURankResponseDto } from './dto/get-dau-rank-response.dto';
import { GetTrafficRankDto } from './dto/get-traffic-rank.dto';
import { CacheTTLUntilMidnight, CustomCacheInterceptor } from '../../common/cache';
import { GetTrafficRankResponseDto } from './dto/get-traffic-rank-response.dto';

@Controller('log/rank')
@UseInterceptors(CustomCacheInterceptor)
@CacheTTLUntilMidnight()
export class RankController {
    constructor(private readonly rankService: RankService) {}

    @Get('/success-rate')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '기수 내 어제 동안 응답 성공률 랭킹',
        description: '요청받은 기수의 기수 내 응답 성공률 랭킹을 반환합니다.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '기수 내 응답 성공률 랭킹이 성공적으로 반환됨.',
        type: GetSuccessRateRankResponseDto,
    })
    async getSuccessRateRank(@Query() getSuccessRateRankDto: GetSuccessRateRankDto) {
        return await this.rankService.getSuccessRateRank(getSuccessRateRankDto);
    }

    @Get('/elapsed-time')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '기수 내 어제 동안 응답 소요 시간 랭킹',
        description: '요청 받은 기수의 어제 하루 동안 응답 소요 시간 랭킹을 반환합니다.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '기수 내 응답 소요 시간 랭킹 데이터가 성공적으로 반환됨.',
        type: GetElapsedTimeRankResponseDto,
    })
    async getElapsedTimeRank(@Query() getElapsedTimeRankDto: GetElapsedTimeRankDto) {
        return await this.rankService.getElapsedTimeRank(getElapsedTimeRankDto);
    }

    @Get('/dau')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '기수 내 어제 동안 DAU 랭킹',
        description: '요청받은 기수의 기수 내 DAU 랭킹을 반환합니다.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '기수 내 DAU 랭킹이 송공적으로 반환됨.',
        type: GetDAURankResponseDto,
    })
    async getDAURank(@Query() getDAURankDto: GetDAURankDto) {
        return await this.rankService.getDAURank(getDAURankDto);
    }

    @Get('/traffic')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '기수 내 전체 데이터 트래픽 랭킹',
        description: '요청받은 기수의 기수 내 트래픽 랭킹을 반환합니다.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '기수 내 트래픽 랭킹이 성공적으로 반환됨.',
        type: GetTrafficRankResponseDto,
    })
    async getTrafficRank(@Query() getTrafficRankDto: GetTrafficRankDto) {
        return await this.rankService.getTrafficRank(getTrafficRankDto);
    }
}
