import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetProjectDauResponseDto } from './dto/get-project-dau-response.dto';
import { GetProjectDAU } from './dto/get-project-dau.dto';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticService: AnalyticsService) {}

    @Get('/dau')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '프로젝트별 DAU 조회',
        description: '프로젝트 이름과 날짜로 해당 프로젝트의 DAU를 반환합니다.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '프로젝트의 DAU가 정상적으로 반환됨.',
        type: GetProjectDauResponseDto,
    })
    async getProjectDAU(@Query() getDAUByProjectDto: GetProjectDAU) {
        return await this.analyticService.getProjectDAU(getDAUByProjectDto);
    }
}
