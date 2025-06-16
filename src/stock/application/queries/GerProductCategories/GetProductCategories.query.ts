import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { ProductCategoryDto } from '../../dtos/ProductCategory.dto';

export class GetProductCategoriesQuery extends Query<WsResponse<ProductCategoryDto[] | string>> {
  constructor() {
    super();
  }
}
