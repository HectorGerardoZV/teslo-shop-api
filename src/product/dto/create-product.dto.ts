import {
    IsOptional,
    IsPositive,
    IsInt,
    IsArray,
    IsString,
    MinLength,
    MaxLength,
    IsNumber,
    IsIn,
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateProductDto {
    @IsString()
    @MinLength(4)
    @MaxLength(70)
    title: string;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    price: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    stock?: number;

    @IsString()
    @IsOptional()
    sizes?: string;

    @IsString()
    @IsIn(['men', 'women', 'girl', 'boy', 'unisex'])
    @IsOptional()
    gender?: string;

    @IsString()
    @IsOptional()
    tags?: string;
}
