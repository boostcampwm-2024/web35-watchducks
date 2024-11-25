import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class TrafficCountByTimeunitMetric {
    @Type(() => Number)
    @IsNumber()
    count: number;

    @IsString()
    timestamp: string;
}
