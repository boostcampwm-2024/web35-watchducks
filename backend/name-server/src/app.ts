import * as dgram from 'dgram';
import * as dnsPacket from 'dns-packet';
import { configDotenv } from 'dotenv';

configDotenv();

const PROXY_SERVER_IP = process.env.PROXY_SERVER_IP as string;
const NAME_SERVER_PORT = process.env.NAME_SERVER_PORT as unknown as number;

const server = dgram.createSocket('udp4');

function hasQuestions(
    packet: dnsPacket.Packet,
): packet is dnsPacket.Packet & { questions: dnsPacket.Question[] } {
    return Array.isArray(packet.questions) && packet.questions.length > 0;
}

function hasFlags(
    packet: dnsPacket.Packet,
): packet is dnsPacket.Packet & { flags: number | undefined } {
    return packet.flags !== undefined;
}

const DNS_FLAGS = {
    AUTHORITATIVE_ANSWER: 0x0400, // 권한 있는 응답 (네임서버가 해당 도메인의 공식 서버일 때)
    TRUNCATED_RESPONSE: 0x0200, // 응답이 잘린 경우 (UDP 크기 제한 초과)
    RECURSION_DESIRED: 0x0100, // 재귀적 쿼리 요청 (클라이언트가 설정)
    RECURSION_AVAILABLE: 0x0080, // 재귀 쿼리 지원 여부
    AUTHENTIC_DATA: 0x0020, // DNSSEC 검증된 데이터
    CHECKING_DISABLED: 0x0010, // DNSSEC 검증 비활성화
} as const;

function createFlags(query: dnsPacket.Packet): number {
    let flags = DNS_FLAGS.AUTHORITATIVE_ANSWER;

    // 클라이언트의 재귀 요청 플래그 유지
    if (query.flags && query.flags & DNS_FLAGS.RECURSION_DESIRED) {
        flags |= DNS_FLAGS.RECURSION_DESIRED;
    }

    return flags;
}

server.on('message', (msg, remoteInfo) => {
    try {
        const query = dnsPacket.decode(msg);

        if (!hasQuestions(query)) {
            console.error('DNS query에는 questions가 없습니다.');
            return;
        }

        if (!hasFlags(query)) {
            console.error('DNS query에는 flags가 없습니다.');
            return;
        }

        const question = query.questions[0]; // 첫 번째 질문만 처리

        console.log(
            `Received query for ${question.name} from ${remoteInfo.address}:${remoteInfo.port}`,
        );

        const response: dnsPacket.Packet = {
            id: query.id,
            type: 'response',
            flags: createFlags(query),
            questions: query.questions,
            answers: [
                {
                    name: question.name,
                    type: 'A',
                    class: 'IN',
                    ttl: 300,
                    data: PROXY_SERVER_IP,
                },
            ],
        };
        const responseMsg = dnsPacket.encode(response);

        server.send(responseMsg, remoteInfo.port, remoteInfo.address);
    } catch (err) {
        console.error('Failed to process DNS query:', err);
    }
});

server.on('error', (err) => {
    console.error(`Server error:\n${err.stack}`);
    server.close();
});

server.on('listening', () => {
    const address = server.address();
    console.log(`Server listening on ${address.address}:${address.port}`);
});

server.bind(NAME_SERVER_PORT);
