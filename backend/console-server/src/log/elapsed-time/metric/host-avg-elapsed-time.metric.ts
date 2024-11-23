import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class HostAvgElapsedTimeMetric {
    @IsString()
    host: string;

    @Type(() => Number)
    @IsNumber()
    avg_elapsed_time: number;
}
