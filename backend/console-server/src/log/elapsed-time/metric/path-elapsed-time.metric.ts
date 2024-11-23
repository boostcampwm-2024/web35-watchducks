import { IsString } from 'class-validator';

export class PathElapsedTimeMetric {
    @IsString()
    avg_elapsed_time: string;

    @IsString()
    path: string;
}
