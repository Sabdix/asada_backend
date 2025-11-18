import { Expose, Type } from 'class-transformer';
import { ProductDto } from './Product.dto';

export class SimpleStockDto
 {
    @Expose()
    @Type(() => ProductDto)
    product?: ProductDto;

}
