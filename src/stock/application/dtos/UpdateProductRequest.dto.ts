import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateProductRequestDto {
    @IsOptional()
    name: string;
    @IsOptional()
    measurementUnit: string;
    @IsOptional()
    uuid_category: string;
}

