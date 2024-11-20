import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class SuccessRateMetric {
    @Type(() => Number)
    @IsNumber()
    success_rate: number;
}
