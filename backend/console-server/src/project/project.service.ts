import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly mailService: MailService,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    try {
      const result = await this.projectRepository.insert(createProjectDto);
      await this.mailService.sendNameServerInfo(
        createProjectDto.email,
        createProjectDto.name,
      );
      return result.identifiers;
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        isUniqueConstraintViolation(error.driverError)
      ) {
        throw new ConflictException(
          'Project with the same domain already exists.',
        );
      }
      throw error;
    }
  }
}

function isUniqueConstraintViolation(error: any): boolean {
  const uniqueViolationCodes = ['ER_DUP_ENTRY', '23505', 'SQLITE_CONSTRAINT'];
  return uniqueViolationCodes.includes(error.code);
}
