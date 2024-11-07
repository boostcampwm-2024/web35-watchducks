import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';

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
      if (error.code === 'ER_DUP_ENTRY')
        throw new ConflictException(
          'Project with the same domain or ID already exists.',
        );
      throw error;
    }
  }
}
