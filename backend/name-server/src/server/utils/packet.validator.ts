import type { Packet, Question } from 'dns-packet';

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
}
