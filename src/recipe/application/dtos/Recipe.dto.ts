import { Expose, Type } from 'class-transformer';
import { RecipeCategoryDto } from './RecipeCategory.dto';

export class RecipeDto {
    @Expose()
    uuid: string;

    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    video: string;

    @Expose()
    pdf: string;

    @Expose()
    uuid_category: string;

    @Expose()
    @Type(() => RecipeCategoryDto)
    category?: RecipeCategoryDto;
}
