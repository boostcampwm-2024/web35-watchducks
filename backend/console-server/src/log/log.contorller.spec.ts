// import { Test } from '@nestjs/testing';
// import type { TestingModule } from '@nestjs/testing';
// import { LogController } from './log.controller';
// import { LogService } from './log.service';
//
// describe('LogController 테스트', () => {
//     let controller: LogController;
//     let service: LogService;
//
//     const mockLogService = {
//         httpLog: jest.fn(),
//         elapsedTime: jest.fn(),
//         trafficRank: jest.fn(),
//         responseSuccessRate: jest.fn(),
//         trafficByGeneration: jest.fn(),
//     };
//
//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             controllers: [LogController],
//             providers: [
//                 {
//                     provide: LogService,
//                     useValue: mockLogService,
//                 },
//             ],
//         }).compile();
//
//         controller = module.get<LogController>(LogController);
//         service = module.get<LogService>(LogService);
//     });
//
//     it('should be defined', () => {
//         expect(controller).toBeDefined();
//     });
//
//     describe('httpLog', () => {
//         it('http logs 로그를 리턴해야 한다.', async () => {
//             const mockResult = [{ date: '2024-03-01', avg_elapsed_time: 100, request_count: 1000 }];
//             mockLogService.httpLog.mockResolvedValue(mockResult);
//
//             const result = await controller.httpLog();
//
//             expect(result).toEqual(mockResult);
//             expect(service.httpLog).toHaveBeenCalled();
//         });
//     });
//
//     describe('elapsedTime', () => {
//         it('average elapsed time를 리턴해야 한다.', async () => {
//             const mockResult = { avg_elapsed_time: 150 };
//             mockLogService.elapsedTime.mockResolvedValue(mockResult);
//
//             const result = await controller.elapsedTime();
//
//             expect(result).toEqual(mockResult);
//             expect(service.elapsedTime).toHaveBeenCalled();
//         });
//     });
//
//     describe('trafficRank', () => {
//         it('top 5 traffic ranks를 리턴해야 한다.', async () => {
//             const mockResult = [
//                 { host: 'api1.example.com', count: 1000 },
//                 { host: 'api2.example.com', count: 800 },
//             ];
//             mockLogService.trafficRank.mockResolvedValue(mockResult);
//
//             const result = await controller.trafficRank();
//
//             expect(result).toEqual(mockResult);
//             expect(service.trafficRank).toHaveBeenCalled();
//         });
//     });
// });
