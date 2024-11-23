import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class TrafficCountMetric {
    @Type(() => Number)
    @IsNumber()
    count: number;
}
