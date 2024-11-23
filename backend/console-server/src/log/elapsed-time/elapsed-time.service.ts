import type { GetAvgElapsedTimeDto } from './dto/get-avg-elapsed-time.dto';
import { plainToInstance } from 'class-transformer';
import { GetAvgElapsedTimeResponseDto } from './dto/get-avg-elapsed-time-response.dto';
import { ElapsedTimeRepository } from './elapsed-time.repository';
import type { GetTop5ElapsedTimeDto } from './dto/get-top5-elapsed-time.dto';
import { GetTop5ElapsedTime, ProjectElapsedTime } from './dto/get-top5-elapsed.time';
import type { Repository } from 'typeorm';
import type { GetPathElapsedTimeRank } from './dto/get-path-elapsed-time.rank';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
    GetPathElapsedTimeResponseDto,
    PathResponseTime,
} from './dto/get-path-elapsed-time-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../../project/entities/project.entity';

@Injectable()
export class ElapsedTimeService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        private readonly elapsedTimeRepository: ElapsedTimeRepository,
    ) {}

    async getAvgElapsedTime(_getAvgElapsedTime: GetAvgElapsedTimeDto) {
        const result = await this.elapsedTimeRepository.findAvgElapsedTime();

        return plainToInstance(GetAvgElapsedTimeResponseDto, result);
    }

    async getTop5ElapsedTime(_getTop5ElapsedTimeDto: GetTop5ElapsedTimeDto) {
        const speedRankData = await this.elapsedTimeRepository.findAvgElapsedTimeLimit();
        const response = await Promise.all(
            speedRankData.map(async (data) => {
                const project = await this.projectRepository.findOne({
                    where: { domain: data.host },
                    select: ['name'],
                });

                return plainToInstance(ProjectElapsedTime, {
                    projectName: project?.name || 'Unknown',
                    avgResponseTime: data.avg_elapsed_time,
                });
            }),
        );

        return plainToInstance(GetTop5ElapsedTime, response);
    }

    async getPathElapsedTimeRank(getPathElapsedTimeRank: GetPathElapsedTimeRank) {
        const { projectName } = getPathElapsedTimeRank;
        const project = await this.projectRepository.findOne({
            where: { name: projectName },
            select: ['domain'],
        });

        if (!project) throw new NotFoundException(`Project with name ${projectName} not found`);

        const fastestPaths = await this.elapsedTimeRepository.getFastestPathsByDomain(
            project.domain,
        );
        const slowestPaths = await this.elapsedTimeRepository.findSlowestPathsByDomain(
            project.domain,
        );

        return plainToInstance(GetPathElapsedTimeResponseDto, {
            projectName,
            fastestPaths: fastestPaths.map((fastestPath) =>
                plainToInstance(PathResponseTime, {
                    path: fastestPath.path,
                    avgResponseTime: fastestPath.avg_elapsed_time,
                }),
            ),
            slowestPaths: slowestPaths.map((slowestPath) =>
                plainToInstance(PathResponseTime, {
                    path: slowestPath.path,
                    avgResponseTime: slowestPath.avg_elapsed_time,
                }),
            ),
        });
    }
}
