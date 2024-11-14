import { validateHost, validateIp, buildTargetUrl } from '../../src/server/utils';
import { MissingHostHeaderError } from '../../src/common/error/missing-host-header.error';
import { DomainNotFoundError } from '../../src/common/error/domain-not-found.error';

describe('Utils 테스트', () => {
    describe('validateHost()는 ', () => {
        it('host가 유효한 경우, 리턴해야 한다.', () => {
            const host = 'example.com';
            expect(validateHost(host)).toBe(host);
        });

        it('host가 undefined인 경우, MissingHostHeaderError를 던져야 한다.', () => {
            expect(() => validateHost(undefined)).toThrow(MissingHostHeaderError);
        });

        it('host가 비어있는 경우, MissingHostHeaderError를 던져야 한다.', () => {
            expect(() => validateHost('')).toThrow(MissingHostHeaderError);
        });
    });

    describe('validateIp()는 ', () => {
        it('IP가 유효한 경우, 에러를 던지지 않아야 한다.', () => {
            expect(() => validateIp('127.0.0.1', 'example.com')).not.toThrow();
        });

        it('IP가 비어있는 경우, DomainNotFoundError를 던져야 한다.', () => {
            expect(() => validateIp('', 'example.com')).toThrow(DomainNotFoundError);
        });

        it('에러 메시지에 host를 포함해야 한다.', () => {
            const host = 'example.com';
            try {
                validateIp('', host);
            } catch (error) {
                expect(error).toBeInstanceOf(DomainNotFoundError);
                expect((error as DomainNotFoundError).message).toContain(host);
            }
        });
    });

    describe('buildTargetUrl()은 ', () => {
        it('path를 포함하여 URL을 올바르게 만들어야 한다.', () => {
            const result = buildTargetUrl('127.0.0.1', '/test', 'http://');
            expect(result).toBe('http://127.0.0.1/test');
        });

        it('path가 없는 경우에도 URL을 올바르게 만들어야 한다.', () => {
            const result = buildTargetUrl('127.0.0.1', '', 'http://');
            expect(result).toBe('http://127.0.0.1/');
        });

        it('다양한 프로토콜을 처리해야 한다.', () => {
            const result = buildTargetUrl('127.0.0.1', '/test', 'https://');
            expect(result).toBe('https://127.0.0.1/test');
        });
    });
});
