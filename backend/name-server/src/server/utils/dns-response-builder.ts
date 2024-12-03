import type { BaseAnswer, Packet, Question } from 'dns-packet';
import type { ServerConfig } from '../../common/utils/validator/configuration.validator';
import { PacketValidator } from './packet.validator';
import type { ResponseCodeType } from '../constant/dns-packet.constant';
import {
    DNS_FLAGS,
    PACKET_TYPE,
    RESPONSE_CODE,
    RESPONSE_CODE_MASK,
    RECORD_CLASS,
    RECORD_TYPE,
} from '../constant/dns-packet.constant';

interface DNSResponse extends Packet {
    answers: BaseAnswer<typeof RECORD_TYPE.ADDRESS, string>[];
    authorities: BaseAnswer<typeof RECORD_TYPE.NAME_SERVER, string>[];
    additionals: BaseAnswer<typeof RECORD_TYPE.ADDRESS, string>[];
}

export class DNSResponseBuilder {
    private readonly response: Partial<DNSResponse>;

    constructor(
        private config: ServerConfig,
        private originalQuery: Packet,
    ) {
        this.response = {
            id: this.originalQuery.id,
            type: PACKET_TYPE.RESPONSE,
            flags: 0,
            questions: this.originalQuery.questions,
        };
    }

    private createFlags(rcode: ResponseCodeType): number {
        let flags = DNS_FLAGS.QUERY_RESPONSE | DNS_FLAGS.AUTHORITATIVE_ANSWER;

        if (
            PacketValidator.hasFlags(this.originalQuery) &&
            this.originalQuery.flags & DNS_FLAGS.RECURSION_DESIRED
        ) {
            flags |= DNS_FLAGS.RECURSION_DESIRED;
        }

        flags |= rcode & RESPONSE_CODE_MASK;

        return flags;
    }

    addAnswer(rcode: ResponseCodeType, question?: Question, targetIp?: string): this {
        this.response.flags = this.createFlags(rcode);

        if (rcode !== RESPONSE_CODE.NOERROR || !question) {
            this.response.answers = [];
            return this;
        }

        this.response.answers = [
            {
                name: question.name,
                type: RECORD_TYPE.ADDRESS,
                class: RECORD_CLASS.INTERNET,
                ttl: this.config.ttl,
                data: targetIp || this.config.proxyServerIp,
            },
        ];
        return this;
    }

    addAuthorities(question?: Question): this {
        if (!question) return this;

        this.response.authorities = this.config.authoritativeNameServers.map((nameServerDomain) => {
            return {
                name: question.name,
                type: RECORD_TYPE.NAME_SERVER,
                class: RECORD_CLASS.INTERNET,
                ttl: this.config.ttl,
                data: nameServerDomain,
            };
        });
        return this;
    }

    addAdditionals(): this {
        this.response.additionals = this.config.authoritativeNameServers.map((nameServerDomain) => {
            return {
                name: nameServerDomain,
                type: RECORD_TYPE.ADDRESS,
                class: RECORD_CLASS.INTERNET,
                ttl: this.config.ttl,
                data: this.config.nameServerIp,
            };
        });
        return this;
    }

    build(): DNSResponse {
        return this.response as DNSResponse;
    }
}
