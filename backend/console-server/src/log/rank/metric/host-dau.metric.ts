import { IsNumber, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class HostDauMetric {
    @IsString()
    @Expose()
    host: string;

    @Type(() => Number)
    @IsNumber()
    @Expose()
    dau: number;
}
