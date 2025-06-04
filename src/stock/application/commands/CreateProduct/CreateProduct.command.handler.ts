import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { ProductCategoryService } from '../../services/ProductCategory.service';
import { CreateProductCommand } from './CreateProduct.command';
import { ProductService } from '../../services/Product.service';
import { ProductDto } from '../../dtos/Product.dto';
;

@CommandHandler(CreateProductCommand)
export class CreateProductCommandHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService
  ) {}

  async execute(command: CreateProductCommand): Promise<WsResponse<ProductDto | string>> {

    if (await this.productService.getProductByName(command.body.name))
        return WsResponse.buildConflictResponse('YA EXISTE UN PRODUCTO CON ESE NOMBRE','PRODUCT ALREADY EXISTS');

    if (!await this.productCategoryService.getProductCategoryByUuid(command.body.uuid_category))
        return WsResponse.buildNotFoundResponse('PRODUCT CATEGORY NOT FOUND');

    const product = await this.productService.creteProduct(command.body)

    const productResponse = await this.productService.getProductByUuid(product.uuid)

    return WsResponse.buildOkResponse(
      plainToInstance(ProductDto, productResponse, { excludeExtraneousValues: true }),
    );
  }
}
