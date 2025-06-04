import { IsNotEmpty } from 'class-validator';

export class CreateProductCategoryRequestDto {
    @IsNotEmpty()
    name: string;
}

