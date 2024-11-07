import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(projectData: Partial<Project>) {
    try {
      const result = await this.projectRepository.insert(projectData);
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
  const uniqueViolationCodes = ['ER_DUP_ENTRY', '23505'];
  return uniqueViolationCodes.includes(error.code);
}
