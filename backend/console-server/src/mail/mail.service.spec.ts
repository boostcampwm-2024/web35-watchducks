import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

describe('MailService의', () => {
  let mailService: MailService;
  let mailerService: MailerService;

  const mockMailerService = {
    sendMail: jest.fn(),
  };
  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'mailer.nameServers') return ['ns.test.site'];
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: MailerService, useValue: mockMailerService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();
    mailService = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendNameServerInfo()는', () => {
    it('mailer 모듈의 sendMail()을 호출합니다.', async () => {
      const email = 'test@test.com';
      const projectName = 'test';

      await mailService.sendNameServerInfo(email, projectName);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        subject: '[와치덕스] 네임서버 정보를 전송합니다.',
        template: './nameserver',
        context: {
          projectName: projectName,
          nameServers: ['ns.test.site'],
        },
      });
    });
  });
});
