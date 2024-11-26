import { Expose, Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class HostErrorRateMetric {
    @IsString()
    @Expose()
    host: string;

    @Type(() => Number)
    @IsNumber()
    @Expose()
    is_error_rate: number;
}
