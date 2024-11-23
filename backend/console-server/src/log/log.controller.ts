import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { LogService } from './log.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetDAUByProjectResponseDto } from './dto/get-dau-by-project-response.dto';
import { GetDAUByProjectDto } from './dto/get-dau-by-project.dto';

@Controller('log')
export class LogController {
    constructor(private readonly logService: LogService) {}

    @Get('/dau')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '프로젝트별 DAU 조회',
        description: '프로젝트 이름과 날짜로 해당 프로젝트의 DAU를 반환합니다.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '프로젝트의 DAU가 정상적으로 반환됨.',
        type: GetDAUByProjectResponseDto,
    })
    async getDAUByProject(@Query() getDAUByProjectDto: GetDAUByProjectDto) {
        return await this.logService.getDAUByProject(getDAUByProjectDto);
    }
}
