import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class TrafficRankMetric {
    @IsString()
    host: string;

    @Type(() => Number)
    @IsNumber()
    count: number;
}
