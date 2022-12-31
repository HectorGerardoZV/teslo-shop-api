import { Type } from 'class-transformer';
import {
    IsInt,
    IsPositive,
    Min
} from 'class-validator';
export class PaginationDto {
    @IsInt()
    @IsPositive()
    @Min(1)
    @Type(() => Number)
    items: number;

    @IsInt()
    @Min(0)
    @Type(() => Number)
    page: number;
}