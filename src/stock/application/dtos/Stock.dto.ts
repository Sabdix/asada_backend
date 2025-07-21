import { Expose, Type } from 'class-transformer';
import { ProductCategoryDto } from './ProductCategory.dto';
import { BranchDto } from 'src/branch/application/dtos/Branch.dto';
import { ProductDto } from './Product.dto';
import { WorkAreaDto } from 'src/user/application/dtos/WorkArea.dto';

export class StockDto {
    @Expose()
    uuid: string;

    @Expose()
    uuid_category: string;

    @Expose()
    uuid_product: string;

    @Expose()
    uuid_branch: string;

    @Expose()
    quantity: number;

    @Expose()
    requiredStock: number;

    @Expose()
    holidayRequiredStock: number;

    @Expose()
    @Type(() => ProductCategoryDto)
    category?: ProductCategoryDto;

    @Expose()
    @Type(() => ProductDto)
    product?: ProductDto;

    @Expose()
    @Type(() => ProductCategoryDto)
    branch?: BranchDto;

    @Expose()
    @Type(() => WorkAreaDto)
    workArea?: WorkAreaDto;
}
