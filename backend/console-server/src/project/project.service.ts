import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import type { CreateProjectDto } from './dto/create-project.dto';
import { ProjectResponseDto } from './dto/create-project-response.dto';
import { plainToInstance } from 'class-transformer';
import { FindByGenerationDto } from './dto/find-by-generation.dto';
import { FindByGenerationResponseDto } from './dto/find-by-generation-response.dto';
import { CountProjectByGenerationDto } from './dto/count-project-by-generation.dto';
import { CountProjectByGenerationResponseDto } from './dto/count-project-by-generation-response.dto';

@Injectable()
export class ProjectService {
    private readonly BASE_YEAR: number = 2015;

    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        private readonly mailService: MailService,
    ) {}

    async create(createProjectDto: CreateProjectDto) {
        try {
            const project = this.projectRepository.create(createProjectDto);
            const result = await this.projectRepository.save(project);

            new Promise((resolve, _reject) =>
                this.mailService
                    .sendNameServerInfo(createProjectDto.email, createProjectDto.name)
                    .then(() => resolve),
            );
            return plainToInstance(ProjectResponseDto, result);
        } catch (error) {
            if (isUniqueConstraintViolation(error))
                throw new ConflictException('Domain already exists.');
            throw error;
        }
    }

    async findByGeneration(findByGenerationDto: FindByGenerationDto) {
        const generation = findByGenerationDto.generation;

        const projects = await this.projectRepository.find({
            select: {
                name: true,
            },
            where: { generation: generation },
        });

        return projects.map((p) => plainToInstance(FindByGenerationResponseDto, p));
    }

    async countProjectByGeneration(countProjectByGenerationDto: CountProjectByGenerationDto) {
        const generation = countProjectByGenerationDto.generation;

        const count = await this.projectRepository.count({
            where: { generation: generation },
        });

        return plainToInstance(CountProjectByGenerationResponseDto, {
            count: count,
        });
    }
}

function isUniqueConstraintViolation(error: Error): boolean {
    if (!(error instanceof QueryFailedError)) return false;
    const code = error.driverError.code;
    const uniqueViolationCodes = ['ER_DUP_ENTRY', 'SQLITE_CONSTRAINT'];

    return uniqueViolationCodes.includes(code);
}
