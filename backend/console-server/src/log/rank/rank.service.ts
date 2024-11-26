import { RankRepository } from './rank.repository';
import { Injectable } from '@nestjs/common';
import { GetSuccessRateRankDto } from './dto/get-success-rate-rank.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../../project/entities/project.entity';
import { In, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import {
    GetSuccessRateRankResponseDto,
    SuccessRateRank,
} from './dto/get-success-rate-rank-response.dto';
import { GetElapsedTimeRankDto } from './dto/get-elapsed-time-rank.dto';
import {
    ElapsedTimeRank,
    GetElapsedTimeRankResponseDto,
} from './dto/get-elapsed-time-rank-response.dto';

@Injectable()
export class RankService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        private readonly rankRepository: RankRepository,
    ) {}

    async getSuccessRateRank(_getSuccessRateRankDto: GetSuccessRateRankDto) {
        const results = await this.rankRepository.findSuccessRateOrderByCount();
        const hosts = results.map((result) => result.host);

        const projects = await this.projectRepository.find({
            select: ['domain', 'name'],
            where: {
                domain: In(hosts),
            },
        });
        const projectMap = new Map(projects.map((project) => [project.domain, project]));

        const rank = results.map((result) => {
            const project = projectMap.get(result.host);

            return plainToInstance(SuccessRateRank, {
                projectName: project?.name || `Unknown`,
                successRate: 100 - result.is_error_rate,
            });
        });

        return plainToInstance(GetSuccessRateRankResponseDto, { total: results.length, rank });
    }

    async getElapsedTimeRank(_getElapsedTimeRankDto: GetElapsedTimeRankDto) {
        const results = await this.rankRepository.findHostOrderByElapsedTimeSince(
            this.getYesterdayDateString(),
        );

        const hosts = results.map((result) => result.host);
        const projectMap = await this.hostsToProjectMap(hosts);
        const rank = results.map<ElapsedTimeRank>((result) => {
            return {
                projectName: projectMap.get(result.host) || `Unknown`,
                elapsedTime: result.avg_elapsed_time,
            };
        });

        return plainToInstance(GetElapsedTimeRankResponseDto, { total: rank.length, rank });
    }

    private getYesterdayDateString() {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        return this.formatDate(yesterday);
    }

    private formatDate(dateInput: Date) {
        const date = new Date(dateInput);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    private async hostsToProjectMap(hosts: string[]) {
        const projects = await this.projectRepository.find({
            select: ['domain', 'name'],
            where: {
                domain: In(hosts),
            },
        });
        return new Map(projects.map(({ domain, name }) => [domain, name]));
    }
}
