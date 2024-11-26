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
import { GetTrafficRankResponseDto, TrafficRank } from './dto/get-traffic-rank-response.dto';
import { GetTrafficRankDto } from './dto/get-traffic-rank.dto';

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

        const projectMap = await this.hostsToProjectMap(hosts);

        const rank = results.map((result) => {
            const project = projectMap.get(result.host);

            return plainToInstance(SuccessRateRank, {
                projectName: project?.name || `Unknown`,
                successRate: 100 - result.is_error_rate,
            });
        });

        return plainToInstance(GetSuccessRateRankResponseDto, { total: results.length, rank });
    }

    async getTrafficRank(_getTrafficRankDto: GetTrafficRankDto) {
        const results = await this.rankRepository.findCountOrderByCount();
        const hosts = results.map((result) => result.host);

        const projectMap = await this.hostsToProjectMap(hosts);

        const rank = results.map((result) => {
            const project = projectMap.get(result.host);

            return plainToInstance(TrafficRank, {
                projectName: project?.name || `Unknown`,
                count: result.count,
            });
        });

        return plainToInstance(GetTrafficRankResponseDto, { total: results.length, rank });
    }

    private async hostsToProjectMap(hosts: string[]) {
        const projects = await this.projectRepository.find({
            select: ['domain', 'name'],
            where: {
                domain: In(hosts),
            },
        });
        return new Map(projects.map((project) => [project.domain, project]));
    }
}
