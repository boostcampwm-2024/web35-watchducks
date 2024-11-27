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
import { GetDAURankDto } from './dto/get-dau-rank.dto';
import { DAURank, GetDAURankResponseDto } from './dto/get-dau-rank-response.dto';
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

    async getDAURank(_getDAURankDto: GetDAURankDto) {
        const yesterday = this.getYesterdayDate();
        const results = await this.rankRepository.findCountOrderByDAU(yesterday);

        const domains = results.map((result) => result.host);
        const projects = await this.projectRepository.find({
            select: ['domain', 'name'],
            where: {
                domain: In(domains),
            },
        });

        const _projectMap = new Map(projects.map((project) => [project.domain, project]));

        const rank = results.map((result) => {
            return plainToInstance(DAURank, {
                host: result.host,
                dau: result.dau,
            });
        });

        return plainToInstance(GetDAURankResponseDto, {
            total: results.length,
            rank,
            date: yesterday,
        });
    }

    private getYesterdayDate(): string {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return date.toISOString().split('T')[0];
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
