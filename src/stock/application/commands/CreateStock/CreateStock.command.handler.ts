import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { ProductCategoryService } from '../../services/ProductCategory.service';
import { ProductService } from '../../services/Product.service';
import { CreateStockCommand } from './CreateStock.command';
import { StockDto } from '../../dtos/Stock.dto';
import { BranchService } from 'src/branch/application/services/Branch.service';
import { StockService } from '../../services/Stock.service';
import { WorkAreaService } from 'src/user/application/services/workArea.service';
;

@CommandHandler(CreateStockCommand)
export class CreateStockCommandHandler implements ICommandHandler<CreateStockCommand> {
    constructor(
        private productService: ProductService,
        private productCategoryService: ProductCategoryService,
        private branchService: BranchService,
        private stockService: StockService,
        private workAreaService: WorkAreaService

    ) { }

    async execute(command: CreateStockCommand): Promise<WsResponse<StockDto | string>> {

        const category = await this.productCategoryService.getProductCategoryByUuid(command.body.uuid_category);
        if (!category)
            return WsResponse.buildNotFoundResponse('CATEGORY NOT FOUND');

        const product = await this.productService.getProductByUuid(command.body.uuid_product);
        if (!product)
            return WsResponse.buildNotFoundResponse('PRODUCT NOT FOUND');

        const branch = await this.branchService.getBranchByUuid(command.body.uuid_branch);
        if (!branch)
            return WsResponse.buildNotFoundResponse('BRANCH NOT FOUND');

        const workArea = await this.workAreaService.getWorkAreaByUuid(command.body.uuid_work_area);
        if (!workArea)
            return WsResponse.buildNotFoundResponse('WORK_AREA NOT FOUND');

        const stock = await this.stockService.creteStock(command.body)

        const stockResponse = await this.stockService.getStockByUuid(stock.uuid)

        return WsResponse.buildOkResponse(
            plainToInstance(StockDto, stockResponse, { excludeExtraneousValues: true }),
        );
    }
}
