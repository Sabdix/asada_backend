import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateProductCommand } from './UpdateProduct.command';
import { ProductService } from '../../services/Product.service';
import { ProductDto } from '../../dtos/Product.dto';
import { ProductCategoryService } from '../../services/ProductCategory.service';



@CommandHandler(UpdateProductCommand)
export class UpdateProductCommandHandler implements ICommandHandler<UpdateProductCommand> {
    constructor(
        private productService: ProductService,
        private productCategoryService: ProductCategoryService,
    ) { }

    async execute(command: UpdateProductCommand): Promise<WsResponse<ProductDto | string>> {

        const product = await this.productService.getProductByUuid(command.uuid);

        if (!product)
            return WsResponse.buildNotFoundResponse('PRODUCT  NOT FOUND');

        product.name = command.body.name ?? product.name;
        product.measurementUnit = command.body.measurementUnit ?? product.measurementUnit;
        product.uuid_category = command.body.uuid_category ?? product.uuid_category;

        const productCategory = await this.productCategoryService.getProductCategoryByUuid(product.uuid_category);
        if (!productCategory)
            return WsResponse.buildNotFoundResponse('PRODUCT CATEGORY NOT FOUND');

        product.category = productCategory;
        
        await this.productService.updateProduct(product);

        return WsResponse.buildOkResponse(
            plainToInstance(ProductDto, product, { excludeExtraneousValues: true }),
        );
    }
}
