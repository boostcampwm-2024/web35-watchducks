import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { MailService } from './mail.service';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [MailService],
    // }).compile();
    //
    // service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    // expect(service).toBeDefined();
  });
});
