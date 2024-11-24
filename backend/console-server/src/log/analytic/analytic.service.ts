import { AnalyticRepository } from './analytic.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetProjectDAU } from './dto/get-project-dau.dto';
import { plainToInstance } from 'class-transformer';
import { GetProjectDauResponseDto } from './dto/get-project-dau-response.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../../project/entities/project.entity';

@Injectable()
export class AnalyticService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        private readonly analyticRepository: AnalyticRepository,
    ) {}

    async getProjectDAU(getProjectDAU: GetProjectDAU) {
        const { projectName, date } = getProjectDAU;
        const project = await this.projectRepository.findOne({
            where: { name: projectName },
            select: ['domain'],
        });

        if (!project) {
            throw new NotFoundException(`Project with name ${projectName} not found`);
        }
        const dau = await this.analyticRepository.findDAUByProject(project.domain, date);

        return plainToInstance(GetProjectDauResponseDto, {
            projectName,
            date,
            dau,
        });
    }
}
