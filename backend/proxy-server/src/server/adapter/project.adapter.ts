import type { ProjectUseCase } from 'domain/port/input/project.use-case';
import { HOST_HEADER } from 'common/constant/http.constant';
import type { FastifyRequest } from 'fastify';

export class ProjectAdapter {
    constructor(private readonly projectUseCase: ProjectUseCase) {}

    async resolveTargetUrl(request: FastifyRequest) {
        return await this.projectUseCase.resolveTargetUrl(
            request.headers[HOST_HEADER] as string,
            request.url,
            request.protocol,
        );
    }
}
