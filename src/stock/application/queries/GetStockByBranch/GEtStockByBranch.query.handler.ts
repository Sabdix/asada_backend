import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { ProductService } from '../../services/Product.service';
import { GetStockByBranchQuery } from './GetStockByBranch.query';
import { StockDto } from '../../dtos/Stock.dto';
import { StockService } from '../../services/Stock.service';
import { BranchService } from 'src/branch/application/services/Branch.service';

@QueryHandler(GetStockByBranchQuery)
export class GetStockByBranchQueryHandler implements IQueryHandler<GetStockByBranchQuery> {
    constructor(
        private stockService: StockService,
        private branchService: BranchService
    ) { }

    async execute(query: GetStockByBranchQuery) {
        const branch = await this.branchService.getBranchByUuid(query.uuid);

        if (!branch) return WsResponse.buildNotFoundResponse('BRANCH  NOT FOUND');

        const stocks = await this.stockService.getStockByBranch(query.uuid);

        return WsResponse.buildOkResponse(
            plainToInstance(StockDto, stocks, { excludeExtraneousValues: true }),
        );
    }
}
