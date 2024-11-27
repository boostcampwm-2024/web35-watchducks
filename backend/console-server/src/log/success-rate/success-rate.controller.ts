import { Controller, Get, HttpCode, HttpStatus, Query, UseInterceptors } from '@nestjs/common';
import { SuccessRateService } from './success-rate.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetSuccessRateResponseDto } from './dto/get-success-rate-response.dto';
import { GetSuccessRateDto } from './dto/get-success-rate.dto';
import { GetProjectSuccessRateResponseDto } from './dto/get-project-success-rate-response.dto';
import { GetProjectSuccessRateDto } from './dto/get-project-success-rate.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { CacheRefreshThreshold, ONE_MINUTE, THREE_MINUTES } from '../../common/cache';

@Controller('log/success-rate')
@UseInterceptors(CacheInterceptor)
@CacheTTL(THREE_MINUTES)
@CacheRefreshThreshold(ONE_MINUTE)
export class SuccessRateController {
    constructor(private readonly successRateService: SuccessRateService) {}

    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '기수 내 응답 성공률',
        description: '요청받은 기수의 기수 내 응답 성공률를 반환합니다.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '기수 내 응답 성공률이 성공적으로 반환됨.',
        type: GetSuccessRateResponseDto,
    })
    async getSuccessRate(@Query() getSuccessRateDto: GetSuccessRateDto) {
        return await this.successRateService.getSuccessRate(getSuccessRateDto);
    }

    @Get('/project')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '프로젝트 별 응답 성공률',
        description: '요청받은 프로젝트의 응답 성공률을 반환합니다.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '프로젝트 별 응답 성공률이 성공적으로 반환됨.',
        type: GetProjectSuccessRateResponseDto,
    })
    async getProjectSuccessRate(@Query() getProjectSuccessRateDto: GetProjectSuccessRateDto) {
        return await this.successRateService.getProjectSuccessRate(getProjectSuccessRateDto);
    }
}
