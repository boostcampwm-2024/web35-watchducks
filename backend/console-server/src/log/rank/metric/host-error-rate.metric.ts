import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class HostErrorRateMetric {
    @IsString()
    host: string;

    @Type(() => Number)
    @IsNumber()
    is_error_rate: number;
}
