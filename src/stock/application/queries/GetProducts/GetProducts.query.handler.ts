import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetProductsQuery } from './GetProducts.query';
import { ProductService } from '../../services/Product.service';
import { ProductDto } from '../../dtos/Product.dto';

@QueryHandler(GetProductsQuery)
export class GetProductsQueryQueryHandler implements IQueryHandler<GetProductsQuery> {
  constructor(private  productService: ProductService) {}

  async execute() {
    const products = await this.productService.getProducts();

    return WsResponse.buildOkResponse(
      plainToInstance(ProductDto, products, { excludeExtraneousValues: true }),
    );
  }
}
