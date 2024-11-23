import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../project/entities/project.entity';
import { Repository } from 'typeorm';
import { LogRepository } from './log.repository';
import { GetDAUByProjectDto } from './dto/get-dau-by-project.dto';
import { GetDAUByProjectResponseDto } from './dto/get-dau-by-project-response.dto';

@Injectable()
export class LogService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        private readonly logRepository: LogRepository,
    ) {}

    async getDAUByProject(getDAUByProjectDto: GetDAUByProjectDto) {
        const { projectName, date } = getDAUByProjectDto;

        const project = await this.projectRepository.findOne({
            where: { name: projectName },
            select: ['domain'],
        });
        if (!project) {
            throw new NotFoundException(`Project with name ${projectName} not found`);
        }
        const dau = await this.logRepository.findDAUByProject(project.domain, date);
        return plainToInstance(GetDAUByProjectResponseDto, {
            projectName,
            date,
            dau,
        });
    }
}
