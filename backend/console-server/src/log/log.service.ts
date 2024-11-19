import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../project/entities/project.entity';
import { Repository } from 'typeorm';
import { LogRepository } from './log.repository';
import { GetPathSpeedRankDto } from './dto/get-path-speed-rank.dto';
import { GetPathSpeedRankResponseDto } from './dto/get-path-speed-rank-response.dto';
import { GetTrafficByProjectDto } from './dto/get-traffic-by-project.dto';
import { GetTrafficByProjectResponseDto } from './dto/get-traffic-by-project-response.dto';
import { GetSuccessRateResponseDto } from './dto/get-success-rate-response.dto';
import { GetSuccessRateDto } from './dto/get-success-rate.dto';
import { GetTrafficByGenerationDto } from './dto/get-traffic-by-generation.dto';
import { GetSuccessRateByProjectResponseDTO } from './dto/get-success-rate-by-project-response.dto';
import { GetSuccessRateByProjectDto } from './dto/get-success-rate-by-project.dto';

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

    async getResponseSuccessRate(_getSuccessRateDto: GetSuccessRateDto) {
        const result = await this.logRepository.findResponseSuccessRate();

        return plainToInstance(GetSuccessRateResponseDto, result);
    }

    async getResponseSuccessRateByProject(getSuccessRateByProjectDto: GetSuccessRateByProjectDto) {
        const { projectName } = getSuccessRateByProjectDto;

        const project = await this.projectRepository.findOne({
            where: { name: projectName },
            select: ['domain'],
        });

        if (!project) throw new NotFoundException(`Project with name ${projectName} not found`);

        const result = await this.logRepository.findResponseSuccessRateByProject(project.domain);

        return plainToInstance(GetSuccessRateByProjectResponseDTO, result);
    }

    async getTrafficByGeneration(_getTrafficByGenerationDto: GetTrafficByGenerationDto) {
        const result = await this.logRepository.findTrafficByGeneration();

        return plainToInstance(GetTrafficByGenerationDto, result[0]);
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

    async getTrafficByProject(getTrafficByProjectDto: GetTrafficByProjectDto) {
        const { projectName, timeUnit } = getTrafficByProjectDto;

        const project = await this.projectRepository.findOne({
            where: { name: projectName },
            select: ['domain'],
        });
        if (!project) throw new NotFoundException(`Project with name ${projectName} not found`);

        const trafficData = await this.logRepository.getTrafficByProject(project.domain, timeUnit);

        return plainToInstance(GetTrafficByProjectResponseDto, {
            projectName,
            timeUnit,
            trafficData,
        });
    }
}
