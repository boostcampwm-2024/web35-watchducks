//
// // log.service.spec.ts
// import { Test, TestingModule } from '@nestjs/testing';
// import { LogService } from './log.service';
// import { LogRepository } from './log.repository';
//
// describe('LogService', () => {
//     let service: LogService;
//     let repository: LogRepository;
//
//     const mockLogRepository = {
//         findHttpLog: jest.fn(),
//         findAvgElapsedTime: jest.fn(),
//         findCountByHost: jest.fn(),
//         findResponseSuccessRate: jest.fn(),
//         findTrafficByGeneration: jest.fn(),
//     };
//
//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             providers: [
//                 LogService,
//                 {
//                     provide: LogRepository,
//                     useValue: mockLogRepository,
//                 },
//             ],
//         }).compile();
//
//         service = module.get<LogService>(LogService);
//         repository = module.get<LogRepository>(LogRepository);
//     });
//
//     it('should be defined', () => {
//         expect(service).toBeDefined();
//     });
//
//     describe('httpLog', () => {
//         it('should return http logs from repository', async () => {
//             const mockLogs = [
//                 { date: '2024-03-01', avg_elapsed_time: 100, request_count: 1000 }
//             ];
//             mockLogRepository.findHttpLog.mockResolvedValue(mockLogs);
//
//             const result = await service.httpLog();
//
//             expect(result).toEqual(mockLogs);
//             expect(repository.findHttpLog).toHaveBeenCalled();
//         });
//     });
//
//     describe('trafficRank', () => {
//         it('should return top 4 traffic ranks', async () => {
//             const mockRanks = [
//                 { host: 'api1.example.com', count: 1000 },
//                 { host: 'api2.example.com', count: 800 },
//                 { host: 'api3.example.com', count: 600 },
//                 { host: 'api4.example.com', count: 400 },
//                 { host: 'api5.example.com', count: 200 }
//             ];
//             mockLogRepository.findCountByHost.mockResolvedValue(mockRanks);
//
//             const result = await service.trafficRank();
//
//             expect(result).toHaveLength(4);
//             expect(result).toEqual(mockRanks.slice(0, 4));
//             expect(repository.findCountByHost).toHaveBeenCalled();
//         });
//     });
//
//     describe('responseSuccessRate', () => {
//         it('should return response success rate', async () => {
//             const mockRate = { success_rate: 98.5 };
//             mockLogRepository.findResponseSuccessRate.mockResolvedValue(mockRate);
//
//             const result = await service.responseSuccessRate();
//
//             expect(result).toEqual(mockRate);
//             expect(repository.findResponseSuccessRate).toHaveBeenCalled();
//         });
//     });
// });
