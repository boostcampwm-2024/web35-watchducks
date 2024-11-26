import { RankService } from './rank.service';
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { GetSuccessRateRankResponseDto } from './dto/get-success-rate-rank-response.dto';
import { GetSuccessRateRankDto } from './dto/get-success-rate-rank.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetElapsedTimeRankResponseDto } from './dto/get-elapsed-time-rank-response.dto';
import { GetElapsedTimeRankDto } from './dto/get-elapsed-time-rank.dto';

@Controller('log/rank')
export class RankController {
    constructor(private readonly rankService: RankService) {}

    @Get('/success-rate')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '기수 내 응답 성공률 랭킹',
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
        summary: '기수 내 응답 소요 시간 랭킹',
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
}
