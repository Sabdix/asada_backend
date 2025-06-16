import { Expose, Type } from 'class-transformer';
import { ProductCategoryDto } from './ProductCategory.dto';

export class ProductDto {
    @Expose()
    name: string;

    @Expose()
    uuid: string;

    @Expose()
    measurementUnit: string;

    @Expose()
    uuid_category: string;

    @Expose()
    @Type(() => ProductCategoryDto)
    category?: ProductCategoryDto;
}
