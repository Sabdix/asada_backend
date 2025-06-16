import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { DeleteProductCommand } from './DeleteProduct.command';
import { ProductService } from '../../services/Product.service';

@CommandHandler(DeleteProductCommand)
export class DeleteProductCommandHandler
    implements ICommandHandler<DeleteProductCommand> {
    constructor(private readonly productService: ProductService) { }

    async execute(command: DeleteProductCommand): Promise<WsResponse<null | string>> {
        const product = await this.productService.getProductByUuid(
            command.uuid,
        );

        if (!product)
            return WsResponse.buildNotFoundResponse('PRODUCT NOT FOUND');

        await this.productService.deleteProduct(command.uuid);

        return WsResponse.buildOkResponse(null);
    }
}
