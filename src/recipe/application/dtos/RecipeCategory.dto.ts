import { Expose } from 'class-transformer';

export class RecipeCategoryDto {
    @Expose()
    name: string;
    @Expose()
    uuid: string;
}
