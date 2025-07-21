import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { ProductService } from '../../services/Product.service';
import { ProductCategoryService } from '../../services/ProductCategory.service';
import { UpdateStockCommand } from './UpdateStock.command';
import { StockDto } from '../../dtos/Stock.dto';
import { BranchService } from 'src/branch/application/services/Branch.service';
import { StockService } from '../../services/Stock.service';
import { WorkAreaService } from 'src/user/application/services/workArea.service';



@CommandHandler(UpdateStockCommand)
export class UpdateStockCommandHandler implements ICommandHandler<UpdateStockCommand> {
    constructor(
        private stockService: StockService,
        private productService: ProductService,
        private productCategoryService: ProductCategoryService,
        private branchService: BranchService,
        private workAreaService: WorkAreaService
    ) { }

    async execute(command: UpdateStockCommand): Promise<WsResponse<StockDto | string>> {

        const stock = await this.stockService.getStockByUuid(command.uuid)
        if (!stock)
            return WsResponse.buildNotFoundResponse('STOCK  NOT FOUND');


        stock.uuid_category = command.body.uuid_category ?? stock.uuid_category;
        stock.uuid_product = command.body.uuid_product ?? stock.uuid_product;
        stock.uuid_branch = command.body.uuid_branch ?? stock.uuid_branch;
        stock.quantity = command.body.quantity ?? stock.quantity;
        stock.requiredStock = command.body.requiredStock ?? stock.requiredStock;
        stock.holidayRequiredStock = command.body.holidayRequiredStock ?? stock.holidayRequiredStock;
        stock.uuid_work_area = command.body.uuid_work_area ?? stock.uuid_work_area;

        const productCategory = await this.productCategoryService.getProductCategoryByUuid(stock.uuid_category);
        if (!productCategory)
            return WsResponse.buildNotFoundResponse('PRODUCT CATEGORY NOT FOUND');

        const product = await this.productService.getProductByUuid(stock.uuid_product);
        if (!product)
            return WsResponse.buildNotFoundResponse('PRODUCT  NOT FOUND');

        const branch = await this.branchService.getBranchByUuid(stock.uuid_branch);
        if (!branch)
            return WsResponse.buildNotFoundResponse('BRANCH  NOT FOUND');

        const workArea = await this.workAreaService.getWorkAreaByUuid(command.body.uuid_work_area);
        if (!workArea)
            return WsResponse.buildNotFoundResponse('WORK_AREA NOT FOUND');

        stock.category = productCategory
        stock.product = product
        stock.branch = branch
        stock.workArea = workArea

        await this.stockService.updateStock(stock);

        return WsResponse.buildOkResponse(
            plainToInstance(StockDto, stock, { excludeExtraneousValues: true }),
        );
    }
}
