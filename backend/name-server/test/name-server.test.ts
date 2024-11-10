import { Server } from '../src/server/server';
import { createSocket } from 'dgram';
import type { Socket, RemoteInfo } from 'dgram';
import type { Logger } from '../src/common/utils/logger/logger';
import { DNSResponseBuilder } from '../src/server/utils/dns-response-builder';
import { decode, encode } from 'dns-packet';
import { PacketValidator } from '../src/server/utils/packet.validator';
import { NORMAL_PACKET } from './constant/packet';

jest.mock('dgram');
jest.mock('dns-packet');
jest.mock('../src/server/utils/dns-response-builder');
jest.mock('../src/common/utils/logger/logger');

describe('NameServer의', () => {
    let mockServer: Socket;
    let mockLogger: jest.Mocked<Logger>;
    let nameServer: Server;
    const mockConfig = {
        nameServerPort: 5353,
        proxyServerIp: '127.0.0.1',
    };

    beforeEach(() => {
        mockServer = {
            on: jest.fn(),
            bind: jest.fn(),
            send: jest.fn((msg, port, address, callback) => callback && callback(null)),
            close: jest.fn(),
            address: jest.fn().mockReturnValue({ address: '127.0.0.1', port: 5353 }),
        } as unknown as Socket;

        (createSocket as jest.Mock).mockReturnValue(mockServer);

        mockLogger = {
            logQuery: jest.fn(),
            error: jest.fn(),
            info: jest.fn(),
        } as unknown as jest.Mocked<Logger>;

        nameServer = new Server(mockConfig, mockLogger);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('start()될 때 ip주소와 포트를 바인딩해야 합니다.', () => {
        nameServer.start();
        expect(mockServer.bind).toHaveBeenCalledWith(mockConfig.nameServerPort);
    });

    it('messageHandler()는 요청을 파싱하여 생성된 응답을 전송합니다.', async () => {
        const mockMsg = Buffer.from('test');
        const mockRemoteInfo: RemoteInfo = {
            address: '127.0.0.1',
            family: 'IPv4',
            port: 12345,
            size: mockMsg.length,
        };
        const mockQuery = NORMAL_PACKET;
        (decode as unknown as jest.Mock).mockReturnValue(mockQuery);
        const mockResponse = Buffer.from('response');
        (encode as unknown as jest.Mock).mockReturnValue(mockResponse);

        const mockResponseBuilderInstance = {
            addAnswer: jest.fn().mockReturnThis(),
            build: jest.fn().mockReturnValue({}),
        };
        (DNSResponseBuilder as jest.Mock).mockReturnValue(mockResponseBuilderInstance);

        // When (메시지 핸들러 호출)
        const messageHandler = (mockServer.on as jest.Mock).mock.calls.find(
            (call) => call[0] === 'message',
        )[1];
        await messageHandler(mockMsg, mockRemoteInfo);

        if (!PacketValidator.hasQuestions(mockQuery)) return;
        expect(decode).toHaveBeenCalledWith(mockMsg);
        expect(mockLogger.logQuery).toHaveBeenCalledWith('example.com', mockRemoteInfo);
        expect(DNSResponseBuilder).toHaveBeenCalledWith(mockQuery, mockConfig);
        expect(mockResponseBuilderInstance.addAnswer).toHaveBeenCalledWith(mockQuery.questions[0]);
        expect(encode).toHaveBeenCalled();
        expect(mockServer.send).toHaveBeenCalled();
    });

    it('messageHandler()는 처리 중 발생하는 에러를 적절히 처리합니다.', async () => {
        const mockMsg = Buffer.from('test');
        const mockRemoteInfo: RemoteInfo = {
            address: '127.0.0.1',
            family: 'IPv4',
            port: 12345,
            size: mockMsg.length,
        };

        const mockError = new Error('Decode error');
        (decode as unknown as jest.Mock).mockImplementation(() => {
            throw mockError;
        });

        const messageHandler = (mockServer.on as jest.Mock).mock.calls.find(
            (call) => call[0] === 'message',
        )[1];
        await messageHandler(mockMsg, mockRemoteInfo);

        expect(mockLogger.error).toHaveBeenCalledWith(
            `Failed to process DNS query from ${mockRemoteInfo.address}:${mockRemoteInfo.port}`,
            mockError,
        );
    });

    it('서버 에러를 적절히 처리합니다.', () => {
        const mockError = new Error('Server error');

        const errorHandler = (mockServer.on as unknown as jest.Mock).mock.calls.find(
            (call) => call[0] === 'error',
        )[1];
        errorHandler(mockError);

        expect(mockLogger.error).toHaveBeenCalledWith('Server error', mockError);
        expect(mockServer.close).toHaveBeenCalled();
    });

    it('logger는 서버가 실행될 때 로깅을 수행합니다.', () => {
        const listeningHandler = (mockServer.on as unknown as jest.Mock).mock.calls.find(
            (call) => call[0] === 'listening',
        )[1];
        listeningHandler();

        expect(mockLogger.info).toHaveBeenCalledWith('Server listening on 127.0.0.1:5353');
    });
});
