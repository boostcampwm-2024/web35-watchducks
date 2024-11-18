import { Injectable, NotFoundException } from '@nestjs/common';
import { LogRepository } from './log.repository';
import { GetPathSpeedRankDto } from './dto/get-path-speed-rank.dto';
import { GetPathSpeedRankResponseDto } from './dto/get-path-speed-rank-response.dto';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../project/entities/project.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        private readonly logRepository: LogRepository,
    ) {}

    async httpLog() {
        const result = await this.logRepository.findHttpLog();

        console.log(result);

        return result;
    }

    async elapsedTime() {
        const result = await this.logRepository.findAvgElapsedTime();

        console.log(result);

        return result;
    }

    async trafficRank() {
        const result = await this.logRepository.findCountByHost();

        return result.slice(0, 5);
    }

    async responseSuccessRate() {
        const result = await this.logRepository.findResponseSuccessRate();

        return result;
    }

    async trafficByGeneration() {
        const result = await this.logRepository.findTrafficByGeneration();

        return result;
    }

    async getPathSpeedRankByProject(getPathSpeedRankDto: GetPathSpeedRankDto) {
        const { projectName } = getPathSpeedRankDto;

        const project = await this.projectRepository.findOne({
            where: { name: projectName },
            select: ['domain'],
        });
        if (!project) throw new NotFoundException(`Project with name ${projectName} not found`);

        const result = await this.logRepository.getPathSpeedRankByProject(project.domain);

        return plainToInstance(GetPathSpeedRankResponseDto, { projectName, ...result });
    }
}
