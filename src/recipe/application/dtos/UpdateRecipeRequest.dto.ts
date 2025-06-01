import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateRecipeRequestDto {
    @IsOptional()
    name?: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    video?: string;

    @IsOptional()
    uuid_category?: string;
}