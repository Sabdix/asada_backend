import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './domain/entities/ProductCategory.entity';
import { StockProduct } from './domain/entities/StockProduct.entity';
import { stockController } from './infrastructure/controllers/stock.controller';
import { ProductCategoryService } from './application/services/ProductCategory.service';
import { ProductCategoryRepository } from './infrastructure/repositories/ProductCategory.repository';
import { StockProductRepository } from './infrastructure/repositories/StockProduct.repository';
import { CreateProductCategoryCommandHandler } from './application/commands/CreateProductCategory/CreateProductCategory.command.handler';
import { GetProductCategoryByUuidQueryHandler } from './application/queries/GetProductCategoryByUuid/GetProductCategoryByUuid.query.handler';
import { GetProductCategoriesQueryHandler } from './application/queries/GerProductCategories/GetProductCategories.query.handler';
import { DeleteProductCategoryCommandHandler } from './application/commands/DeleteProductCategory/DeleteProductCategory.command.handler';
import { UpdateProductCategoryCommandHandler } from './application/commands/UpdateProductCategory/UpdateProductCategory.command.handler';
import { ProductService } from './application/services/Product.service';
import { CreateProductCommandHandler } from './application/commands/CreateProduct/CreateProduct.command.handler';
import { GetProductByUuidQueryHandler } from './application/queries/GetProductByUuid/GetProductByUuid.query.handler';
import { GetProductsQueryQueryHandler } from './application/queries/GetProducts/GetProducts.query.handler';
import { DeleteProductCommandHandler } from './application/commands/DeleteProduct/DeleteProduct.command.handler';
import { UpdateProductCommandHandler } from './application/commands/UpdateProduct/UpdateProduct.command.handler';
import { Stock } from './domain/entities/Stock.entity';
import { StockRepository } from './infrastructure/repositories/Stock.repository';
import { StockService } from './application/services/Stock.service';
import { CreateStockCommandHandler } from './application/commands/CreateStock/CreateStock.command.handler';
import { BranchService } from 'src/branch/application/services/Branch.service';
import { Branch } from 'src/branch/domain/entities/Branch.entity';
import { BranchModule } from 'src/branch/Branch.module';
import { BranchRepository } from 'src/branch/infrastructure/repositories/branch.repository';
import { GetStocksQueryHandler } from './application/queries/GetStocks/GetStocks.query.handler';
import { GetStockByBranchQueryHandler } from './application/queries/GetStockByBranch/GEtStockByBranch.query.handler';
import { GetStockByUuidQueryHandler } from './application/queries/GetStockByUuid/GetStockByUuid.query.handler';
import { DeleteStockCommandHandler } from './application/commands/DeleteStock/DeleteStock.command.handler';
import { UpdateStockCommandHandler } from './application/commands/UpdateStock/UpdateStock.command.handler';
import { StockHistoryService } from './application/services/StockHistory.service';
import { UserService } from 'src/user/application/services/user.service';
import { UserRepository } from 'src/user/infrastructure/repositories/user.repository';
import { UserModule } from 'src/user/User.module';
import { User } from 'src/user/domain/entities/User.entity';
import { ValidateStockCommandHandler } from './application/commands/ValidateStock/ValidateStock.command.handler';
import { StockHistory } from './domain/entities/StockHistory.entity';
import { StockHistoryRepository } from './infrastructure/repositories/StockHistory.repository';
import { WorkArea } from 'src/user/domain/entities/WorkArea.entity';
import { WorkAreaRepository } from 'src/user/infrastructure/repositories/workArea.repository';
import { WorkAreaService } from 'src/user/application/services/workArea.service';
import { DownloadStockReportQueryHandler } from './application/queries/DownloadStockReport/DownloadStockReport.query.handler';
import { DownloadStockClosingReportQueryHandler } from './application/queries/DownloadStockClosingReport/DownloadStockClosingReport.query.handler';
import { StockEntrances } from './domain/entities/StockEntrances.entity';
import { StockEntrancesRepository } from './infrastructure/repositories/StockEntrances.repository';
import { StockEntrancesService } from './application/services/StockEntrances.service';
import { CreateStockEntranceCommandHandler } from './application/commands/CreateStockEntrance/CreateStockEntrance.command.handler';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      ProductCategory,
      StockProduct,
      Stock,
      Branch,
      User,
      StockHistory,
      WorkArea,
      StockEntrances,
    ]),
    BranchModule,
    UserModule,
  ],
  providers: [
    ProductCategoryRepository,
    StockProductRepository,
    StockRepository,
    BranchRepository,
    UserRepository,
    StockHistoryRepository,
    StockEntrancesRepository,
    WorkAreaRepository,

    ProductService,
    ProductCategoryService,
    StockService,
    BranchService,
    UserService,
    StockHistoryService,
    StockEntrancesService,
    WorkAreaService,

    GetProductsQueryQueryHandler,
    GetProductByUuidQueryHandler,
    DownloadStockReportQueryHandler,
    DownloadStockClosingReportQueryHandler,

    CreateProductCommandHandler,
    DeleteProductCommandHandler,
    UpdateProductCommandHandler,

    GetProductCategoryByUuidQueryHandler,
    GetProductCategoriesQueryHandler,

    DeleteProductCategoryCommandHandler,
    UpdateProductCategoryCommandHandler,
    CreateProductCategoryCommandHandler,

    GetStocksQueryHandler,
    GetStockByBranchQueryHandler,
    GetStockByUuidQueryHandler,

    CreateStockEntranceCommandHandler,

    CreateStockCommandHandler,
    DeleteStockCommandHandler,
    UpdateStockCommandHandler,
    ValidateStockCommandHandler,
  ],
  exports: [
    ProductCategoryService,
    ProductService,
    StockService,
    StockHistoryService,
    StockEntrancesService,
  ],
  controllers: [stockController],
})
export class StockModule {}
