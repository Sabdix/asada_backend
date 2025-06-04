import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { DeleteProductCategoryCommand } from './DeleteProductCategory.command';
import { ProductCategoryService } from '../../services/ProductCategory.service';

@CommandHandler(DeleteProductCategoryCommand)
export class DeleteProductCategoryCommandHandler
    implements ICommandHandler<DeleteProductCategoryCommand> {
    constructor(private readonly productCategoryService: ProductCategoryService) { }

    async execute(command: DeleteProductCategoryCommand): Promise<WsResponse<null | string>> {
        const productCategory = await this.productCategoryService.getProductCategoryByUuid(
            command.uuid,
        );

        if (!productCategory)
            return WsResponse.buildNotFoundResponse('PRODUCT CATEGORY NOT FOUND');

        await this.productCategoryService.deleteProductCategory(command.uuid);

        return WsResponse.buildOkResponse(null);
    }
}
