import type { Packet, Question, RecordClass } from 'dns-packet';
import type { ServerConfig } from '../../common/utils/validator/configuration.validator';
import { PacketValidator } from './packet.validator';
import type { ResponseCodeType } from '../constant/dns-packet.constant';
import { DNS_FLAGS, RESPONSE_CODE } from '../constant/dns-packet.constant';

interface DNSResponse extends Packet {
    answers: Array<{
        name: string;
        type: 'A';
        class: RecordClass;
        ttl: number;
        data: string;
    }>;
}

export class DNSResponseBuilder {
    private readonly response: Partial<DNSResponse>;

    constructor(
        private config: ServerConfig,
        query: Packet,
    ) {
        this.response = {
            id: query.id,
            type: 'response',
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
        this.response.flags = 0x8000;

        if (this.response.flags && rcode === RESPONSE_CODE.NXDOMAIN) {
            this.response.flags |= RESPONSE_CODE.NXDOMAIN;
        }

        if (rcode === RESPONSE_CODE.NOERROR && question) {
            this.response.answers = [
                {
                    name: question.name,
                    type: 'A',
                    class: 'IN',
                    ttl: 86400,
                    data: this.config.proxyServerIp,
                },
            ];
            return this;
        }
        this.response.answers = [];

        return this;
    }

    build(): DNSResponse {
        return this.response as DNSResponse;
    }
}
