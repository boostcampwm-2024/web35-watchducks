import { IsString } from 'class-validator';

export class TrafficChartMetric {
    @IsString()
    host: string;

    @IsString()
    traffic: string[][];
}
