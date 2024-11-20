import type { Socket } from 'dgram';
import { createSocket, type RemoteInfo } from 'dgram';
import { decode, encode } from 'dns-packet';
import type { DecodedPacket, Question } from 'dns-packet';
import type { ServerConfig } from 'common/utils/validator/configuration.validator';
import { PacketValidator } from './utils/packet.validator';
import { DNSResponseBuilder } from './utils/dns-response-builder';
import { ResponseCode } from './constant/dns-packet.constant';
import { logger } from 'common/utils/logger/console.logger';
import { ServerError } from './error/server.error';
import type { ProjectQueryInterface } from 'database/query/project.query.interface';
import type { DAURecorderInterface } from 'database/query/dau-recorder';

export class Server {
    private server: Socket;

    constructor(
        private readonly config: ServerConfig,
        private readonly dauRecorder: DAURecorderInterface,
        private readonly projectQuery: ProjectQueryInterface,
    ) {
        this.server = createSocket('udp4');
        this.initializeServer();
    }

    private initializeServer(): void {
        this.server.on('message', this.handleMessage.bind(this));
        this.server.on('error', this.handleError.bind(this));
        this.server.on('listening', this.handleListening.bind(this));
    }

    private async handleMessage(msg: Buffer, remoteInfo: RemoteInfo): Promise<void> {
        try {
            const query = decode(msg);
            const question = this.parseQuery(query);

            console.log(query); // TODO: 삭제

            logger.logQuery(question.name, remoteInfo);

            await this.validateRequest(question.name);
            this.dauRecorder.recordAccess(question.name).catch((err) => {
                logger.error(`DAU recording failed for ${question.name}: ${err.message}`);
            });

            const response = new DNSResponseBuilder(this.config, query)
                .addAnswer(ResponseCode.NOERROR, question)
                .build();
            const responseMsg = encode(response);

            await this.sendResponse(responseMsg, remoteInfo);
        } catch (error) {
            await this.handleQueryError(error as Error, msg, remoteInfo);
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
            .addAnswer(ResponseCode.NXDOMAIN)
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
        this.server.close();
    }
}
