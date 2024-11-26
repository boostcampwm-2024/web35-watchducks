import { AnalyticsRepository } from './analytics.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetDAUsByProjectDto } from './dto/get-project-dau.dto';
import { plainToInstance } from 'class-transformer';
import { GetProjectDauResponseDto } from './dto/get-project-dau-response.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../../project/entities/project.entity';
import { DauMetric } from './metric/dau.metric';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        private readonly analyticRepository: AnalyticsRepository,
    ) {}

    async getDAUsByProject(getDAUsByProjectDto: GetDAUsByProjectDto) {
        const { projectName } = getDAUsByProjectDto;
        const project = await this.projectRepository.findOne({
            where: { name: projectName },
            select: ['domain'],
        });
        if (!project) throw new NotFoundException(`Project with name ${projectName} not found`);

        const { start, end } = this.calculateDAUsStartEndDate();
        const dauRecords = await this.analyticRepository.findDAUsByProject(
            project.domain,
            start,
            end,
        );

        const filledRecords = this.fillDauRecords(start, dauRecords);

        return plainToInstance(GetProjectDauResponseDto, {
            projectName,
            dauRecords: filledRecords,
        });
    }

    private calculateDAUsStartEndDate() {
        const end = new Date();
        const start = new Date(end);
        start.setDate(end.getDate() - 29);
        return { start, end };
    }

    private fillDauRecords(start: Date, originalRecords: DauMetric[]) {
        const recordMap = new Map<string, number>();
        originalRecords.forEach((record) => {
            const dateKey = this.formatDate(record.date);
            recordMap.set(dateKey, record.dau);
        });

        return Array.from({ length: 30 }, (_, i) => {
            const date = new Date(start.getTime());
            date.setDate(start.getDate() + i);
            const dateKey = this.formatDate(date);
            const dau = recordMap.get(dateKey) || 0;
            return { date: dateKey, dau };
        });
    }

    private formatDate(dateInput: Date): string {
        const date = new Date(dateInput);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
