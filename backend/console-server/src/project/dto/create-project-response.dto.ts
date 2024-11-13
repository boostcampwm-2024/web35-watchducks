import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProjectResponseDto {
    @Expose()
    id: number;
}
