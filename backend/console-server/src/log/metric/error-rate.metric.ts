import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class ErrorRateMetric {
    @Type(() => Number)
    @IsNumber()
    is_error_rate: number;
}
