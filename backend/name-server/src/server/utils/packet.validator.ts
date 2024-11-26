import type { Packet, Question } from 'dns-packet';
import type { MessageType } from '../../server/constant/message-type.constants';
import { MESSAGE_TYPE, MIN_DNS_MESSAGE_LENGTH } from '../../server/constant/message-type.constants';

type TypeGuardResult<T> = T extends Packet ? T & { questions: Question[] } : never;

export class PacketValidator {
    static hasQuestions(packet: Packet): packet is TypeGuardResult<Packet> {
        return Array.isArray(packet.questions) && packet.questions.length > 0;
    }

    static hasFlags(packet: Packet): packet is Packet & { flags: number } {
        return typeof packet.flags === 'number';
    }

    static validatePacket(packet: Packet): boolean {
        return this.hasQuestions(packet) && this.hasFlags(packet);
    }

    static validateMessageType(msg: Buffer): MessageType {
        if (msg.length >= MIN_DNS_MESSAGE_LENGTH) {
            const flags = msg.readUInt16BE(2);
            const isQuery = (flags & 0x8000) === 0;

            if (isQuery) {
                const questionCount = msg.readUInt16BE(4);
                if (questionCount > 0) {
                    return MESSAGE_TYPE.DNS;
                }
            }
        }

        return MESSAGE_TYPE.HEALTH_CHECK;
    }
}
