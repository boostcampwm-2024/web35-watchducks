import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  /** TODO: 매직넘버 제거 */
  async sendNameServerInfo(email: string, projectName: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: '[와치덕스] 네임서버 정보를 전송합니다.',
      template: './nameserver',
      context: {
        projectName: projectName,
        nameServers: [],
      },
    });
  }
}
