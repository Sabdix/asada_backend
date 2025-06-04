import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { ProductDto } from '../../dtos/Product.dto';

export class GetProductByUuidQuery extends Query<WsResponse<ProductDto | string>> {
  constructor(public readonly uuid: string) {
    super();
  }
}
