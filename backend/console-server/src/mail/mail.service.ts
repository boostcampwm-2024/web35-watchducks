import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly nameServers: string[];

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.nameServers = this.configService.get<string[]>(
      'mailer.nameServers',
    ) as string[];
  }

  async sendNameServerInfo(email: string, projectName: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: '[와치덕스] 네임서버 정보를 전송합니다.',
      template: './nameserver',
      context: {
        projectName: projectName,
        nameServers: this.nameServers,
      },
    });
  }
}
