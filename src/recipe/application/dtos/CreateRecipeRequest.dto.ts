import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRecipeRequestDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    description: string;

    @IsOptional()
    video: string;

    @IsNotEmpty()
    uuid_category: string;
}