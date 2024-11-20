import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class AvgElapsedTimeMetric {
    @Type(() => Number)
    @IsNumber()
    avg_elapsed_time: number;
}
