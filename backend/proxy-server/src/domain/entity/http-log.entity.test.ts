import { HttpLogEntity } from 'domain/entity/http-log.entity';
import type { HttpLogType } from 'domain/port/input/log.use-case';

describe('HttpLogEntity 테스트', () => {
    let log: HttpLogType;

    beforeEach(() => {
        log = {
            method: 'GET',
            host: 'api.example.com',
            path: '/users',
            statusCode: 200,
            responseTime: 100,
            userIp: '127.0.0.1',
        };
    });

    it('모든 속성을 가지고 인스턴스를 생성해야 한다.', () => {
        const httpLogEntity = new HttpLogEntity(log);

        expect(httpLogEntity.method).toBe(log.method);
        expect(httpLogEntity.host).toBe(log.host);
        expect(httpLogEntity.path).toBe(log.path);
        expect(httpLogEntity.statusCode).toBe(log.statusCode);
        expect(httpLogEntity.responseTime).toBe(log.responseTime);
    });

    it('path 속성이 undefined인 경우에 올바르게 처리해야 한다.', () => {
        log.path = undefined;

        const httpLogEntity = new HttpLogEntity(log);

        expect(httpLogEntity.path).toBeUndefined();
    });
});
