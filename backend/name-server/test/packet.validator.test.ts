import { PacketValidator } from '../src/server/utils/packet.validator';
import { EMPTY_PACKET, NONE_QUESTION_PACKET, NORMAL_PACKET } from './constant/packet';

describe('PacketValidator의', () => {
    describe('validatePacket()는', () => {
        it('유효한 패킷에 true를 반환합니다.', () => {
            expect(PacketValidator.validatePacket(NORMAL_PACKET)).toBe(true);
        });

        it('유효하지 않은 패킷에 false를 반환합니다.', () => {
            expect(PacketValidator.validatePacket(EMPTY_PACKET)).toBe(false);
        });
    });

    describe('hasQuestions()는', () => {
        it('패킷에 question이 있다면 true를 반환합니다.', () => {
            expect(PacketValidator.hasQuestions(NORMAL_PACKET)).toBe(true);
        });

        it('패킷에 question이 없다면 false를 반환합니다.', () => {
            expect(PacketValidator.hasQuestions(NONE_QUESTION_PACKET)).toBe(false);
        });
    });
});
