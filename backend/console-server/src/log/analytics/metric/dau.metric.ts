import { Expose, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class DauMetric {
    @Expose()
    @Type(() => Date)
    date: Date;

    @Expose()
    @Type(() => Number)
    @IsNumber()
    dau: number;
}
