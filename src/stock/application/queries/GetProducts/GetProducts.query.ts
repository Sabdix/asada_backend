import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { ProductDto } from '../../dtos/Product.dto';

export class GetProductsQuery extends Query<WsResponse<ProductDto[] | string>> {
  constructor(
    public readonly size: number,
    public readonly offset: number,
    public readonly name: string,
    public readonly category: string


  ) {
    super();
  }
}
