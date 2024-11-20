import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../project/entities/project.entity';
import { Repository } from 'typeorm';
import { LogRepository } from './log.repository';
import { GetPathSpeedRankDto } from './dto/get-path-speed-rank.dto';
import {
    GetPathSpeedRankResponseDto,
    ResponseTimeByPath,
} from './dto/get-path-speed-rank-response.dto';
import { GetTrafficByProjectDto } from './dto/get-traffic-by-project.dto';
import {
    GetTrafficByProjectResponseDto,
    TrafficCountByTimeunit,
} from './dto/get-traffic-by-project-response.dto';
import { GetDAUByProjectDto } from './dto/get-dau-by-project.dto';
import { GetDAUByProjectResponseDto } from './dto/get-dau-by-project-response.dto';
import { GetSuccessRateResponseDto } from './dto/get-success-rate-response.dto';
import { GetSuccessRateDto } from './dto/get-success-rate.dto';
import { GetTrafficByGenerationDto } from './dto/get-traffic-by-generation.dto';
import { GetSuccessRateByProjectResponseDto } from './dto/get-success-rate-by-project-response.dto';
import { GetSuccessRateByProjectDto } from './dto/get-success-rate-by-project.dto';
import { GetAvgElapsedTimeResponseDto } from './dto/get-avg-elapsed-time-response.dto';
import { GetTrafficRankResponseDto } from './dto/get-traffic-rank-response.dto';
import { GetTrafficByGenerationResponseDto } from './dto/get-traffic-by-generation-response.dto';

@Injectable()
export class LogService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        private readonly logRepository: LogRepository,
    ) {}

    async getAvgElapsedTime() {
        const result = await this.logRepository.findAvgElapsedTime();

        return plainToInstance(GetAvgElapsedTimeResponseDto, result);
    }

    async getTrafficRank() {
        const result = await this.logRepository.findTop5CountByHost();

        return plainToInstance(GetTrafficRankResponseDto, result);
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

        return plainToInstance(GetSuccessRateByProjectResponseDto, {
            projectName,
            ...result,
        });
    }

    async getTrafficByGeneration(_getTrafficByGenerationDto: GetTrafficByGenerationDto) {
        const result = await this.logRepository.findTrafficByGeneration();

        return plainToInstance(GetTrafficByGenerationResponseDto, result);
    }

    async getPathSpeedRankByProject(getPathSpeedRankDto: GetPathSpeedRankDto) {
        const { projectName } = getPathSpeedRankDto;
        const project = await this.projectRepository.findOne({
            where: { name: projectName },
            select: ['domain'],
        });

        if (!project) throw new NotFoundException(`Project with name ${projectName} not found`);

        console.log('??');

        const fastestPaths = await this.logRepository.getFastestPathsByDomain(project.domain);
        const slowestPaths = await this.logRepository.getSlowestPathsByDomain(project.domain);

        return plainToInstance(GetPathSpeedRankResponseDto, {
            projectName,
            fastestPaths: fastestPaths.map((fastestPath) =>
                plainToInstance(ResponseTimeByPath, {
                    path: fastestPath.path,
                    avgResponseTime: fastestPath.avg_elapsed_time,
                }),
            ),
            slowestPaths: slowestPaths.map((slowestPath) =>
                plainToInstance(ResponseTimeByPath, {
                    path: slowestPath.path,
                    avgResponseTime: slowestPath.avg_elapsed_time,
                }),
            ),
        });
    }

    async getTrafficByProject(getTrafficByProjectDto: GetTrafficByProjectDto) {
        const { projectName, timeUnit } = getTrafficByProjectDto;

        const project = await this.projectRepository.findOne({
            where: { name: projectName },
            select: ['domain'],
        });
        if (!project) throw new NotFoundException(`Project with name ${projectName} not found`);

        const results = await this.logRepository.getTrafficByProject(project.domain, timeUnit);

        return plainToInstance(GetTrafficByProjectResponseDto, {
            projectName,
            timeUnit,
            trafficData: results.map((result) => plainToInstance(TrafficCountByTimeunit, result)),
        });
    }

    async getDAUByProject(getDAUByProjectDto: GetDAUByProjectDto) {
        const { projectName, date } = getDAUByProjectDto;

        const project = await this.projectRepository.findOne({
            where: { name: projectName },
            select: ['domain'],
        });
        if (!project) {
            throw new NotFoundException(`Project with name ${projectName} not found`);
        }
        const dau = await this.logRepository.getDAUByProject(project.domain, date);
        return plainToInstance(GetDAUByProjectResponseDto, {
            projectName,
            date,
            dau,
        });
    }
}
