import type { Socket } from 'dgram';
import { createSocket, type RemoteInfo } from 'dgram';
import { decode, encode } from 'dns-packet';
import type { DecodedPacket, Question } from 'dns-packet';
import type { ServerConfig } from '../common/utils/validator/configuration.validator';
import { PacketValidator } from './utils/packet.validator';
import { DNSResponseBuilder } from './utils/dns-response-builder';
import { RESPONSE_CODE } from './constant/dns-packet.constant';
import { logger } from '../common/utils/logger/console.logger';
import { ServerError } from './error/server.error';
import type { ProjectQueryInterface } from '../database/query/project.query.interface';
import { MESSAGE_TYPE } from '../server/constant/message-type.constants';
import { HealthCheckService } from '../server/service/health-check.service';
import type { CacheQueryInterface } from 'database/query/cache.query.interface';

interface ResolvedRoute {
    targetIp: string;
    isValid: boolean;
}

export class Server {
    private server: Socket;
    private healthCheckService: HealthCheckService;

    constructor(
        private readonly config: ServerConfig,
        private readonly projectQuery: ProjectQueryInterface,
        private readonly cacheQuery: CacheQueryInterface,
    ) {
        this.server = createSocket('udp4');
        this.healthCheckService = new HealthCheckService(
            config.healthCheckIp,
            config.proxyHealthCheckEndpoint,
        );
        this.initializeServer();
    }

    private initializeServer(): void {
        this.server.on('message', this.handleMessage.bind(this));
        this.server.on('error', this.handleError.bind(this));
        this.server.on('listening', this.handleListening.bind(this));
        this.healthCheckService.startHealthCheck();
    }

    private async resolveRoute(domainName: string): Promise<ResolvedRoute> {
        try {
            let clientIp = await this.cacheQuery.findIpByDomain(domainName);

            if (!clientIp) {
                clientIp = await this.projectQuery.getClientIpByDomain(domainName);
                void this.cacheQuery
                    .cacheIpByDomain(domainName, clientIp)
                    .catch((err) =>
                        logger.error(`Failed to cache IP for domain ${domainName}:`, err),
                    );
            }

            const targetIp = this.healthCheckService.isProxyHealthy()
                ? this.config.proxyServerIp
                : clientIp;

            return { targetIp, isValid: true };
        } catch (error) {
            logger.error('Failed to resolve route:', error);
            return { targetIp: '', isValid: false };
        }
    }

    private async handleMessage(msg: Buffer, remoteInfo: RemoteInfo): Promise<void> {
        try {
            const messageType = PacketValidator.validateMessageType(msg);

            if (messageType === MESSAGE_TYPE.HEALTH_CHECK) {
                await this.handleNginxHealthCheck(remoteInfo);
                return;
            }

            const query = decode(msg);
            const question = this.parseQuery(query);

            logger.logQuery(question.name, remoteInfo);

            await this.validateRequest(question.name);

            const route = await this.resolveRoute(question.name);
            if (!route.isValid) {
                throw new Error('Invalid domain name');
            }

            const response = new DNSResponseBuilder(this.config, query)
                .addAnswer(RESPONSE_CODE.NOERROR, question, route.targetIp)
                .addAuthorities(question)
                .addAdditionals()
                .build();

            const responseMsg = encode(response);

            await this.sendResponse(responseMsg, remoteInfo);
        } catch (error) {
            await this.handleQueryError(error as Error, msg, remoteInfo);
        }
    }

    private async handleNginxHealthCheck(remoteInfo: RemoteInfo): Promise<void> {
        try {
            const healthCheckResponse = Buffer.from([]);

            await this.sendResponse(healthCheckResponse, remoteInfo);
        } catch (error) {
            logger.error(`Health check response failed: ${(error as Error).message}`);
        }
    }

    private async validateRequest(name: string): Promise<void> {
        if (await this.projectQuery.existsByDomain(name)) {
            return;
        }
        throw new Error('Not found domain name');
    }

    private parseQuery(query: DecodedPacket): Question {
        if (!PacketValidator.validatePacket(query)) {
            throw new ServerError('Invalid DNS query packet structure');
        }
        if (!PacketValidator.hasQuestions(query)) {
            throw new ServerError('DNS query packet has no question');
        }

        return query.questions[0];
    }

    private async sendResponse(msg: Buffer, remoteInfo: RemoteInfo): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server.send(msg, remoteInfo.port, remoteInfo.address, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    private async handleQueryError(
        error: Error,
        msg: Buffer,
        remoteInfo: RemoteInfo,
    ): Promise<void> {
        const query = decode(msg);

        const errorMessage = `Failed to process DNS query from ${remoteInfo.address}:${remoteInfo.port}`;
        const response = new DNSResponseBuilder(this.config, query)
            .addAnswer(RESPONSE_CODE.NXDOMAIN)
            .build();

        const responseMsg = encode(response);

        await this.sendResponse(responseMsg, remoteInfo);
        logger.error(errorMessage, error);
    }

    private handleError(error: Error): void {
        logger.error('Server error', error);
        this.stop();
    }

    private handleListening(): void {
        const address = this.server.address();
        logger.info(`Server listening on ${address.address}:${address.port}`);
    }

    public start(): void {
        this.server.bind(this.config.nameServerPort);
    }

    public stop(): void {
        this.healthCheckService.stopHealthCheck();
        this.server.close();
    }
}
