import { IsNotEmpty } from 'class-validator';

export class CreateProductRequestDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    measurementUnit: string;
    @IsNotEmpty()
    uuid_category: string;
}

