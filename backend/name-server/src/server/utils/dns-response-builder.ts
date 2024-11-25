import type { BaseAnswer, Packet, Question } from 'dns-packet';
import type { ServerConfig } from '../../common/utils/validator/configuration.validator';
import { PacketValidator } from './packet.validator';
import type { ResponseCodeType } from '../constant/dns-packet.constant';
import {
    DNS_FLAGS,
    PACKET_TYPE,
    RESPONSE_CODE,
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
        query: Packet,
    ) {
        this.response = {
            id: query.id,
            type: PACKET_TYPE.RESPONSE,
            flags: this.createFlags(query),
            questions: query.questions,
        };
    }

    private createFlags(query: Packet): number {
        const flags = DNS_FLAGS.AUTHORITATIVE_ANSWER;

        if (PacketValidator.hasFlags(query) && query.flags & DNS_FLAGS.RECURSION_DESIRED) {
            return flags | DNS_FLAGS.RECURSION_DESIRED;
        }

        return flags;
    }

    addAnswer(rcode: ResponseCodeType, question?: Question): this {
        this.response.flags = DNS_FLAGS.QUERY_RESPONSE;

        if (this.response.flags && rcode === RESPONSE_CODE.NXDOMAIN) {
            this.response.flags |= RESPONSE_CODE.NXDOMAIN;
        }

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
                data: this.config.proxyServerIp,
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
