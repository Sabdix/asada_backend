import { IsNotEmpty } from 'class-validator';

export class UpdateRecipeCategoryRequestDto {
    @IsNotEmpty()
    name: string;
}

