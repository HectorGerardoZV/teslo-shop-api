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

export class CreateProductDto {
    @IsString()
    @MinLength(4)
    @MaxLength(70)
    title: string;

    @IsNumber()
    @IsPositive()
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
    stock?: number;

    @IsString({ each: true })
    @IsArray()
    sizes?: string[];

    @IsString()
    @IsIn(['men', 'women', 'girl', 'boy', 'unisex'])
    @IsOptional()
    gender?: string;

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags?: string[];

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];
}
