import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetProductByUuidQuery } from './GetProductByUuid.query';
import { ProductDto } from '../../dtos/Product.dto';
import { ProductService } from '../../services/Product.service';

@QueryHandler(GetProductByUuidQuery)
export class GetProductByUuidQueryHandler implements IQueryHandler<GetProductByUuidQuery> {
  constructor(private  productService: ProductService) {}

  async execute(query:GetProductByUuidQuery) {
    const product = await this.productService.getProductByUuid(query.uuid);

    if (!product) return WsResponse.buildNotFoundResponse('PRODUCT  NOT FOUND');

    return WsResponse.buildOkResponse(
      plainToInstance(ProductDto, product, { excludeExtraneousValues: true }),
    );
  }
}
