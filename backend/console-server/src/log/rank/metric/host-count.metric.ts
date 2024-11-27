import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class HostCountMetric {
    @IsString()
    host: string;

    @Type(() => Number)
    @IsNumber()
    count: number;
}
