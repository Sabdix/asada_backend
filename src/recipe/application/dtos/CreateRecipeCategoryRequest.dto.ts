import { IsNotEmpty } from 'class-validator';

export class CreateRecipeCategoryRequestDto {
    @IsNotEmpty()
    name: string;
}

