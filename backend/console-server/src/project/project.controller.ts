import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { FindByGenerationDto } from './dto/find-by-generation.dto';

@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createProjectDto: CreateProjectDto) {
        return this.projectService.create(createProjectDto);
    }

    @Get('/generation')
    @HttpCode(HttpStatus.OK)
    findByGeneration(@Param('generation') findGenerationProjectDto: FindByGenerationDto) {
        return this.projectService.findByGeneration(findGenerationProjectDto);
    }
}
