import { IsNotEmpty } from 'class-validator';

export class UpdateProductCategoryRequestDto {
    @IsNotEmpty()
    name: string;
}

