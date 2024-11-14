import { Clickhouse } from './clickhouse';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
    imports: [ConfigModule],
    providers: [Clickhouse],
    exports: [Clickhouse],
})
export class ClickhouseModule {}
