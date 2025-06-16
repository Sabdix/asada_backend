import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CreateProductCategoryCommand } from './CreateProductCategory.command';
import { ProductCategoryDto } from '../../dtos/ProductCategory.dto';
import { plainToInstance } from 'class-transformer';
import { ProductCategoryService } from '../../services/ProductCategory.service';
;

@CommandHandler(CreateProductCategoryCommand)
export class CreateProductCategoryCommandHandler implements ICommandHandler<CreateProductCategoryCommand> {
  constructor(
    private productCategoryService: ProductCategoryService,
  ) {}

  async execute(command: CreateProductCategoryCommand): Promise<WsResponse<ProductCategoryDto | string>> {

    if (await this.productCategoryService.getProductCategoryByName(command.body.name))
        return WsResponse.buildConflictResponse('YA EXISTE UNA CATEGORIA CON ESE NOMBRE','PRODUCT CATEGORY ALREADY EXISTS');

    const productCategory = await this.productCategoryService.creteProductCategory(command.body)

    return WsResponse.buildOkResponse(
      plainToInstance(ProductCategoryDto, productCategory, { excludeExtraneousValues: true }),
    );
  }
}
