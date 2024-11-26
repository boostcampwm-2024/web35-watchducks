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
}
