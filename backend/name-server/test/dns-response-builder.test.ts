import { DNSResponseBuilder } from '../src/server/utils/dns-response-builder';
import type { Packet } from 'dns-packet';
import { DNSFlags } from '../src/server/server';
import { PacketValidator } from '../src/server/utils/packet.validator';

describe('DNSResponseBuilder의', () => {
    const mockConfig = {
        proxyServerIp: '127.0.0.1',
        nameServerPort: 5353,
    };

    const mockQuery: Packet = {
        type: 'query',
        id: 1234,
        flags: DNSFlags.RECURSION_DESIRED,
        questions: [
            {
                name: 'example.com',
                type: 'A',
                class: 'IN',
            },
        ],
    };

    test('build()는 권한 있는 응답 플래그를 추가하여 DNS 응답을 생성해야 합니다.', () => {
        const builder = new DNSResponseBuilder(mockQuery, mockConfig);

        const response = builder.build();

        expect(response.id).toBe(mockQuery.id);
        expect(response.type).toBe('response');
        expect(response.flags).toBe(DNSFlags.AUTHORITATIVE_ANSWER | DNSFlags.RECURSION_DESIRED);
    });

    test('addAnswer()는 올바른 정보를 담은 answer를 추가해야 합니다.', () => {
        const builder = new DNSResponseBuilder(mockQuery, mockConfig);

        if (!PacketValidator.hasQuestions(mockQuery)) return;
        builder.addAnswer(mockQuery.questions[0]);
        const response = builder.build();

        expect(response.answers).toHaveLength(1);
        expect(response.answers[0]).toEqual({
            name: 'example.com',
            type: 'A',
            class: 'IN',
            ttl: 300,
            data: '127.0.0.1',
        });
    });
});
