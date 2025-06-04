import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateProductCategoryCommand } from './UpdateProductCategory.command';
import { ProductCategoryService } from '../../services/ProductCategory.service';
import { ProductCategoryDto } from '../../dtos/ProductCategory.dto';



@CommandHandler(UpdateProductCategoryCommand)
export class UpdateProductCategoryCommandHandler implements ICommandHandler<UpdateProductCategoryCommand> {
    constructor(
        private productCategoryService: ProductCategoryService,
    ) { }

    async execute(command: UpdateProductCategoryCommand): Promise<WsResponse<ProductCategoryDto | string>> {

        const productCategory = await this.productCategoryService.getProductCategoryByUuid(command.uuid);

        if (!productCategory)
            return WsResponse.buildNotFoundResponse('PRODUCT CATEGORY NOT FOUND');

        productCategory.name = command.body.name;
        await this.productCategoryService.updateProductCategory(productCategory);

        return WsResponse.buildOkResponse(
            plainToInstance(ProductCategoryDto, productCategory, { excludeExtraneousValues: true }),
        );
    }
}
