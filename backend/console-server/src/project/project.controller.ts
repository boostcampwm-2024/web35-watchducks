import { Controller, Get, HttpCode, HttpStatus, Query, UseInterceptors } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { FindByGenerationDto } from './dto/find-by-generation.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProjectResponseDto } from './dto/create-project-response.dto';
import { CountProjectByGenerationDto } from './dto/count-project-by-generation.dto';
import { FindByGenerationResponseDto } from './dto/find-by-generation-response.dto';
import { CountProjectByGenerationResponseDto } from './dto/count-project-by-generation-response.dto';
import { ExistsProjectDto } from './dto/exists-project.dto';
import { ExistsProjectResponseDto } from './dto/exists-project-response.dto';
import {
    CacheRefreshThreshold,
    CustomCacheInterceptor,
    ONE_MINUTE_HALF,
    THREE_MINUTES,
} from '../common/cache';
import { CacheTTL } from '@nestjs/cache-manager';

@Controller('project')
@UseInterceptors(CustomCacheInterceptor)
@CacheTTL(THREE_MINUTES)
@CacheRefreshThreshold(ONE_MINUTE_HALF)
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: '프로젝트 생성 API', description: '새로운 프로젝트를 생성합니다.' })
    @ApiResponse({
        status: 201,
        description: '사용자가 성공적으로 생성됨',
        type: ProjectResponseDto,
    })
    @ApiResponse({ status: 409, description: '중복된 도메인네임 요청' })
    @ApiResponse({ status: 400, description: '잘못된 ip 주소' })
    create(@Body() createProjectDto: CreateProjectDto) {
        return this.projectService.create(createProjectDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '기수별 프로젝트 목록 API',
        description: '요청된 기수에 대한 프로젝트 명을 반환합니다.',
    })
    @ApiResponse({
        status: 200,
        description: '프로젝트 목록이 성공적으로 반환됨',
        type: FindByGenerationResponseDto,
    })
    findByGeneration(@Query() findGenerationProjectDto: FindByGenerationDto) {
        return this.projectService.findByGeneration(findGenerationProjectDto);
    }

    @Get('/count')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '기수 내 전체 프로젝트 개수',
        description: '요청받은 기수의 전체 프로젝트 개수를 반환합니다.',
    })
    @ApiResponse({
        status: 200,
        description: '기수의 전체 프로젝트 개수가 정상적으로 반환됨',
        type: CountProjectByGenerationResponseDto,
    })
    async countProjectByGeneration(
        @Query() countProjectByGenerationDto: CountProjectByGenerationDto,
    ) {
        return await this.projectService.countProjectByGeneration(countProjectByGenerationDto);
    }

    @Get('/exists')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '프로젝트명 유효성 검사',
        description: '요청받은 프로젝트명에 대한 유효성 검사 결과를 반환합니다.',
    })
    @ApiResponse({
        status: 200,
        description: '프로젝트명이 유효성 검사 결과가 반환됨',
        type: ExistsProjectResponseDto,
    })
    async existProject(@Query() existsProjectDto: ExistsProjectDto) {
        return await this.projectService.existsProject(existsProjectDto);
    }
}
