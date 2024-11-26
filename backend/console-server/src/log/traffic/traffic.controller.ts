import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetTrafficTop5ResponseDto } from './dto/get-traffic-top5-response.dto';
import { GetTrafficTop5Dto } from './dto/get-traffic-top5.dto';
import { GetTrafficByProjectResponseDto } from './dto/get-traffic-by-project-response.dto';
import { GetTrafficByProjectDto } from './dto/get-traffic-by-project.dto';
import { GetTrafficByGenerationResponseDto } from './dto/get-traffic-by-generation-response.dto';
import { GetTrafficByGenerationDto } from './dto/get-traffic-by-generation.dto';
import { GetTrafficDailyDifferenceResponseDto } from './dto/get-traffic-daily-difference-response.dto';
import { GetTrafficDailyDifferenceDto } from './dto/get-traffic-daily-difference.dto';
import { GetTrafficTop5ChartResponseDto } from './dto/get-traffic-top5-chart-response.dto';
import { GetTrafficTop5ChartDto } from './dto/get-traffic-top5-chart.dto';
import { TrafficService } from './traffic.service';

@Controller('log/traffic')
export class TrafficController {
    constructor(private readonly trafficService: TrafficService) {}

    @Get('/rank')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '기수 내 트래픽 랭킹 TOP 5',
        description: '요청받은 기수의 트래픽 랭킹 TOP 5를 반환합니다.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '트래픽 랭킹 TOP 5가 정상적으로 반환됨.',
        type: GetTrafficTop5ResponseDto,
    })
    async getTrafficTop5(@Query() getTrafficTop5Dto: GetTrafficTop5Dto) {
        return await this.trafficService.getTrafficTop5(getTrafficTop5Dto);
    }

    @Get('/project')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '프로젝트 별 트래픽 조회',
        description: '프로젝트 이름과 시간 단위로 특정 프로젝트의 트래픽 데이터를 반환합니다.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '특정 프로젝트의 트래픽 데이터가 반환됨.',
        type: GetTrafficByProjectResponseDto,
    })
    async getTrafficByProject(@Query() getTrafficByProjectDto: GetTrafficByProjectDto) {
        return await this.trafficService.getTrafficByProject(getTrafficByProjectDto);
    }

    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '기수 내 총 트래픽',
        description: ' 요청받은 기수의 기수 내 총 트래픽를 반환합니다.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '기수 내 총 트래픽이 정상적으로 반환됨.',
        type: GetTrafficByGenerationResponseDto,
    })
    async getTrafficByGeneration(@Query() getTrafficByGenerationDto: GetTrafficByGenerationDto) {
        return await this.trafficService.getTrafficByGeneration(getTrafficByGenerationDto);
    }

    @Get('/daily-difference')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '기수 별 프로젝트 전일 대비 트래픽',
        description: '요청받은 기수의 프로젝트 전일 대비 트래픽을 반환합니다.',
    })
    @ApiResponse({
        status: 200,
        description: '기수별 프로젝트 전일 대비 트래픽이 정상적으로 반환됨',
        type: GetTrafficDailyDifferenceResponseDto,
    })
    async getTrafficDailyDifferenceByGeneration(
        @Query() getTrafficDailyDifferenceDto: GetTrafficDailyDifferenceDto,
    ) {
        return await this.trafficService.getTrafficDailyDifferenceByGeneration(
            getTrafficDailyDifferenceDto,
        );
    }

    @Get('/top5/line-chart')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '프로젝트 트래픽 TOP 5에 대한 트래픽 데이터 조회',
        description: '프로젝트별 작일 데이터 전체 타임스탬프를 반환',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '프로젝트별 작일 데이터 전체 타임스탬프가 정상적으로 반환됨',
        type: GetTrafficTop5ChartResponseDto,
    })
    async getTrafficTop5Chart(@Query() getTrafficTop5ChartDto: GetTrafficTop5ChartDto) {
        return await this.trafficService.getTrafficTop5Chart(getTrafficTop5ChartDto);
    }
}
