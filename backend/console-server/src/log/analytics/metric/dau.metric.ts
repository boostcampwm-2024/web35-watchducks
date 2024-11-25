import { Expose, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class DauMetric {
    @Expose()
    @Type(() => Number)
    @IsNumber()
    dau: number;
}
