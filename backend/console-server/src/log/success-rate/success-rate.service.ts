import type { GetSuccessRateDto } from './dto/get-success-rate.dto';
import { plainToInstance } from 'class-transformer';
import { GetSuccessRateResponseDto } from './dto/get-success-rate-response.dto';
import type { GetProjectSuccessRateDto } from './dto/get-project-success-rate.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetProjectSuccessRateResponseDto } from './dto/get-project-success-rate-response.dto';
import type { Repository } from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { SuccessRateRepository } from './success-rate.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SuccessRateService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        private readonly successRateRepository: SuccessRateRepository,
    ) {}

    async getSuccessRate(_getSuccessRateDto: GetSuccessRateDto) {
        const result = await this.successRateRepository.findSuccessRate();

        return plainToInstance(GetSuccessRateResponseDto, result);
    }

    async getProjectSuccessRate(getProjectSuccessRateDto: GetProjectSuccessRateDto) {
        const { projectName } = getProjectSuccessRateDto;

        const project = await this.projectRepository.findOne({
            where: { name: projectName },
            select: ['domain'],
        });

        if (!project) throw new NotFoundException(`Project with name ${projectName} not found`);

        const result = await this.successRateRepository.findSuccessRateByProject(project.domain);

        return plainToInstance(GetProjectSuccessRateResponseDto, {
            projectName,
            ...result,
        });
    }
}
