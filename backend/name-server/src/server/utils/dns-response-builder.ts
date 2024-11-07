import type { Packet, Question, RecordClass } from 'dns-packet';
import type { ServerConfig } from '../../utils/validator/configuration.validator';
import { PacketValidator } from '../../utils/validator/packet.validator';
import type { ResponseCode } from '../name-server';
import { DNSFlags } from '../name-server';

export interface DNSResponse extends Packet {
    answers: Array<{
        name: string;
        type: 'A';
        class: RecordClass;
        ttl: number;
        data: string;
        rcode: number;
    }>;
}

export class DNSResponseBuilder {
    private readonly response: Partial<DNSResponse>;

    constructor(
        query: Packet,
        private config: ServerConfig,
    ) {
        this.response = {
            id: query.id,
            type: 'response',
            flags: this.createFlags(query),
            questions: query.questions,
        };
    }

    private createFlags(query: Packet): number {
        let flags = DNSFlags.AUTHORITATIVE_ANSWER;

        if (PacketValidator.hasFlags(query) && query.flags & DNSFlags.RECURSION_DESIRED) {
            flags |= DNSFlags.RECURSION_DESIRED;
        }

        return flags;
    }

    addAnswer(question: Question, rcode: ResponseCode): this {
        this.response.answers = [
            {
                name: question.name,
                type: 'A',
                class: 'IN',
                ttl: 300,
                data: this.config.proxyServerIp,
                rcode,
            },
        ];
        return this;
    }

    build(): DNSResponse {
        return this.response as DNSResponse;
    }
}
