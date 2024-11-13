import { HttpLogEntity } from '../../../src/domain/log/http-log.entity';

describe('HttpLogEntity 테스트', () => {
    it('모든 속성을 가지고 인스턴스를 생성해야 한다..', () => {
        const log = {
            method: 'GET',
            host: 'api.example.com',
            path: '/users',
            statusCode: 200,
            responseTime: 100,
        };

        const httpLogEntity = new HttpLogEntity(log);

        expect(httpLogEntity.method).toBe(log.method);
        expect(httpLogEntity.host).toBe(log.host);
        expect(httpLogEntity.path).toBe(log.path);
        expect(httpLogEntity.statusCode).toBe(log.statusCode);
        expect(httpLogEntity.responseTime).toBe(log.responseTime);
    });

    it('path 속성이 undefined인 경우에 올바르게 처리해야 한다.', () => {
        const log = {
            method: 'POST',
            host: 'api.example.com',
            path: undefined,
            statusCode: 201,
            responseTime: 150,
        };

        const httpLogEntity = new HttpLogEntity(log);

        expect(httpLogEntity.path).toBeUndefined();
    });
});
