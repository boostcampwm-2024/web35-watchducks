import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetProjectDauResponseDto } from './dto/get-project-dau-response.dto';
import { GetDAUsByProjectDto } from './dto/get-project-dau.dto';
import { AnalyticsService } from './analytics.service';

@Controller('log/analytics')
export class AnalyticsController {
    constructor(private readonly analyticService: AnalyticsService) {}

    @Get('/dau')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '프로젝트별 최근 30일 DAU 조회',
        description: '이름을 받은 프로젝트의 최근 30일간 DAU를 반환합니다.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '프로젝트의 30일간 DAU 정보가 정상적으로 반환됨.',
        type: GetProjectDauResponseDto,
    })
    async getDAUsByProject(@Query() getDAUsByProjectDto: GetDAUsByProjectDto) {
        return await this.analyticService.getDAUsByProject(getDAUsByProjectDto);
    }
}
