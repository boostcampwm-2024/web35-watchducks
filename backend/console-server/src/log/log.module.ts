import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';

@Module({
  controllers: [LogController],
  providers: [LogService],
})
export class LogModule {}
