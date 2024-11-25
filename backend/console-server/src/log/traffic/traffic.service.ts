import type { GetTrafficTop5Dto } from './dto/get-traffic-top5.dto';
import { plainToInstance } from 'class-transformer';
import { GetTrafficRankResponseDto } from './dto/get-traffic-rank-response.dto';
import type { GetTrafficByGenerationDto } from './dto/get-traffic-by-generation.dto';
import { GetTrafficByGenerationResponseDto } from './dto/get-traffic-by-generation-response.dto';
import type { GetTrafficDailyDifferenceDto } from './dto/get-traffic-daily-difference.dto';
import { GetTrafficDailyDifferenceResponseDto } from './dto/get-traffic-daily-difference-response.dto';
import type { GetTrafficByProjectDto } from './dto/get-traffic-by-project.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
    GetTrafficByProjectResponseDto,
    TrafficCountByTimeunit,
} from './dto/get-traffic-by-project-response.dto';
import { Project } from '../../project/entities/project.entity';
import type { Repository } from 'typeorm';
import { TrafficRepository } from './traffic.repository';
import type { GetTrafficTop5ChartDto } from './dto/get-traffic-top5-chart.dto';
import {
    GetTrafficTop5ChartResponseDto,
    TrafficTop5Chart,
} from './dto/get-traffic-top5-chart-response.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TrafficService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        private readonly trafficRepository: TrafficRepository,
    ) {}

    async getTrafficTop5(_getTrafficTop5Dto: GetTrafficTop5Dto) {
        const result = await this.trafficRepository.findTop5CountByHost();

        return plainToInstance(GetTrafficRankResponseDto, result);
    }

    async getTrafficByGeneration(_getTrafficByGenerationDto: GetTrafficByGenerationDto) {
        const result = await this.trafficRepository.findTrafficByGeneration();

        return plainToInstance(GetTrafficByGenerationResponseDto, result);
    }

    private calculateTimeRanges() {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const yesterdayStart = new Date();
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);
        yesterdayStart.setHours(0, 0, 0, 0);

        const yesterdayEnd = new Date(todayStart);

        return {
            today: { start: todayStart, end: new Date() },
            yesterday: { start: yesterdayStart, end: yesterdayEnd },
        };
    }

    private async fetchTrafficData(timeRange: { start: Date; end: Date }) {
        const result = await this.trafficRepository.findTrafficForTimeRange(
            timeRange.start,
            timeRange.end,
        );
        return result[0].count;
    }

    private formatTrafficDifference(difference: number): string {
        return difference > 0 ? `+${difference}` : `${difference}`;
    }

    async getTrafficDailyDifferenceByGeneration(
        _getTrafficDailyDifferenceDto: GetTrafficDailyDifferenceDto,
    ) {
        const timeRanges = this.calculateTimeRanges();

        const [today, yesterday] = await Promise.all([
            this.fetchTrafficData(timeRanges.today),
            this.fetchTrafficData(timeRanges.yesterday),
        ]);

        const difference = today - yesterday;
        const result = {
            traffic_daily_difference: this.formatTrafficDifference(difference),
        };

        return plainToInstance(GetTrafficDailyDifferenceResponseDto, result);
    }

    async getTrafficByProject(getTrafficByProjectDto: GetTrafficByProjectDto) {
        const { projectName, timeUnit } = getTrafficByProjectDto;

        const project = await this.projectRepository.findOne({
            where: { name: projectName },
            select: ['domain'],
        });
        if (!project) throw new NotFoundException(`Project with name ${projectName} not found`);

        const results = await this.trafficRepository.findTrafficByProject(project.domain, timeUnit);

        return plainToInstance(GetTrafficByProjectResponseDto, {
            projectName,
            timeUnit,
            trafficData: results.map((result) => plainToInstance(TrafficCountByTimeunit, result)),
        });
    }

    async getTrafficTop5Chart(_getTrafficTop5ChartDto: GetTrafficTop5ChartDto) {
        const results = await this.trafficRepository.findTrafficTop5Chart();

        const trafficCharts = await Promise.all(
            results.map(async (result) => {
                const host = result.host;
                const project = await this.projectRepository
                    .createQueryBuilder('project')
                    .select('project.name')
                    .where('project.domain = :domain', { domain: host })
                    .getOne();

                const projectName = project?.name;

                return plainToInstance(TrafficTop5Chart, {
                    name: projectName,
                    traffic: result.traffic,
                });
            }),
        );

        return plainToInstance(GetTrafficTop5ChartResponseDto, trafficCharts);
    }
}
