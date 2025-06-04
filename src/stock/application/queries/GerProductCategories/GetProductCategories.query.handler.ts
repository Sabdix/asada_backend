import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetProductCategoriesQuery } from './GetProductCategories.query';
import { ProductCategoryDto } from '../../dtos/ProductCategory.dto';
import { ProductCategoryService } from '../../services/ProductCategory.service';

@QueryHandler(GetProductCategoriesQuery)
export class GetProductCategoriesQueryHandler implements IQueryHandler<GetProductCategoriesQuery> {
  constructor(private  productCategoryService: ProductCategoryService) {}

  async execute() {
    const productCategories = await this.productCategoryService.getProductCategories();

    return WsResponse.buildOkResponse(
      plainToInstance(ProductCategoryDto, productCategories, { excludeExtraneousValues: true }),
    );
  }
}
