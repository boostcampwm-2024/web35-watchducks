import { IsString } from 'class-validator';

export class ElapsedTimeByPathMetric {
    @IsString()
    avg_elapsed_time: string;

    @IsString()
    path: string;
}
