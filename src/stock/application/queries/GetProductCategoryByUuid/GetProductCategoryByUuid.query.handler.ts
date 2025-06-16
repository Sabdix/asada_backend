import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetProductCategoryByUuidQuery } from './GetProductCategoryByUuid.query';
import { ProductCategoryDto } from '../../dtos/ProductCategory.dto';
import { ProductCategoryService } from '../../services/ProductCategory.service';

@QueryHandler(GetProductCategoryByUuidQuery)
export class GetProductCategoryByUuidQueryHandler implements IQueryHandler<GetProductCategoryByUuidQuery> {
  constructor(private  productCategoryService: ProductCategoryService) {}

  async execute(query:GetProductCategoryByUuidQuery) {
    const productCategory = await this.productCategoryService.getProductCategoryByUuid(query.uuid);

    if (!productCategory) return WsResponse.buildNotFoundResponse('PRODUCT CATEGORY NOT FOUND');

    return WsResponse.buildOkResponse(
      plainToInstance(ProductCategoryDto, productCategory, { excludeExtraneousValues: true }),
    );
  }
}
