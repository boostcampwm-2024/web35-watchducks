import type { GetTrafficTop5Dto } from './dto/get-traffic-top5.dto';
import { plainToInstance } from 'class-transformer';
import { GetTrafficTop5ResponseDto, TrafficRankData } from './dto/get-traffic-top5-response.dto';
import type { GetTrafficByGenerationDto } from './dto/get-traffic-by-generation.dto';
import { GetTrafficByGenerationResponseDto } from './dto/get-traffic-by-generation-response.dto';
import type { GetTrafficDailyDifferenceDto } from './dto/get-traffic-daily-difference.dto';
import { GetTrafficDailyDifferenceResponseDto } from './dto/get-traffic-daily-difference-response.dto';
import type { GetTrafficByProjectDto } from './dto/get-traffic-by-project.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
    GetTrafficByProjectResponseDto,
    TrafficCountByTimeUnit,
} from './dto/get-traffic-by-project-response.dto';
import { Project } from '../../project/entities/project.entity';
import { In, Repository } from 'typeorm';
import { TrafficRepository } from './traffic.repository';
import type { GetTrafficTop5ChartDto } from './dto/get-traffic-top5-chart.dto';
import {
    GetTrafficTop5ChartResponseDto,
    TrafficTop5Chart,
} from './dto/get-traffic-top5-chart-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TIME_RANGE, TIME_RANGE_UNIT_MAP, TimeRange } from './traffic.constant';

@Injectable()
export class TrafficService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        private readonly trafficRepository: TrafficRepository,
    ) {}

    async getTrafficTop5(_getTrafficTop5Dto: GetTrafficTop5Dto) {
        const result = await this.trafficRepository.findTop5CountByHost();
        const hosts = result.map((item) => item.host);
        const projectMap = await this.hostsToProjectMap(hosts);

        const rank = result.map<TrafficRankData>((item) => {
            return {
                projectName: projectMap.get(item.host) || 'Unknown',
                count: item.count || 0,
            };
        });

        return plainToInstance(GetTrafficTop5ResponseDto, { rank });
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
        const { projectName, timeRange } = getTrafficByProjectDto;
        const project = await this.projectRepository.findOne({
            where: { name: projectName },
            select: ['domain'],
        });
        if (!project) throw new NotFoundException(`Project with name ${projectName} not found`);

        const { start, end } = this.calculateDateTimeRange(timeRange);
        const timeUnit = TIME_RANGE_UNIT_MAP[timeRange];
        if (!timeUnit) throw new Error(`Invalid timeRange value: ${timeRange}`);

        const results = await this.trafficRepository.findTrafficByProject(
            project.domain,
            start,
            end,
            timeUnit,
        );

        return plainToInstance(GetTrafficByProjectResponseDto, {
            projectName,
            domain: project.domain,
            timeRange,
            total: results.reduce((acc, curr) => acc + curr.count, 0),
            trafficData: results.map<TrafficCountByTimeUnit>((result) => result),
        });
    }

    private calculateDateTimeRange(timeRange: TimeRange): { start: Date; end: Date } {
        const end = new Date();
        const start = new Date(end.getTime());

        switch (timeRange) {
            case TIME_RANGE.DAY:
                start.setHours(start.getHours() - 24);
                break;
            case TIME_RANGE.WEEK:
                start.setDate(start.getDate() - 7);
                break;
            case TIME_RANGE.MONTH:
                start.setMonth(start.getMonth() - 1);
                break;
            default:
                throw new Error(`Invalid timeRange value: ${timeRange}`);
        }
        return { start, end };
    }

    async getTrafficTop5Chart(_getTrafficTop5ChartDto: GetTrafficTop5ChartDto) {
        const results = await this.trafficRepository.findTrafficTop5Chart();

        const trafficCharts = await Promise.all(
            results.map(async (result) => {
                const host = result.host;
                const project = await this.projectRepository.findOne({
                    select: ['name'],
                    where: { domain: host },
                });

                const projectName = project?.name;

                return plainToInstance(TrafficTop5Chart, {
                    name: projectName,
                    traffic: result.traffic,
                });
            }),
        );

        return plainToInstance(GetTrafficTop5ChartResponseDto, { trafficCharts });
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
