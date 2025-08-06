import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetProductsQuery } from './GetProducts.query';
import { ProductService } from '../../services/Product.service';
import { ProductDto } from '../../dtos/Product.dto';

@QueryHandler(GetProductsQuery)
export class GetProductsQueryQueryHandler implements IQueryHandler<GetProductsQuery> {
  constructor(private  productService: ProductService) {}

  async execute(query: GetProductsQuery) {
    const [products, total] = await this.productService.getProductsPaginated(query.size, query.offset, query.name, query.category);

    return WsResponse.buildOkListResponse(
      plainToInstance(ProductDto, products, { excludeExtraneousValues: true }), total
    );
  }
}
