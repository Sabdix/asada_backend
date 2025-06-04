import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductCategory } from "./domain/entities/ProductCategory.entity";
import { StockProduct } from "./domain/entities/StockProduct.entity";
import { stockController } from "./infrastructure/controllers/stock.controller";
import { ProductCategoryService } from "./application/services/ProductCategory.service";
import { ProductCategoryRepository } from "./infrastructure/repositories/ProductCategory.repository";
import { StockProductRepository } from "./infrastructure/repositories/StockProduct.repository";
import { CreateProductCategoryCommandHandler } from "./application/commands/CreateProductCategory/CreateProductCategory.command.handler";
import { GetProductCategoryByUuidQueryHandler } from "./application/queries/GetProductCategoryByUuid/GetProductCategoryByUuid.query.handler";
import { GetProductCategoriesQueryHandler } from "./application/queries/GerProductCategories/GetProductCategories.query.handler";
import { DeleteProductCategoryCommandHandler } from "./application/commands/DeleteProductCategory/DeleteProductCategory.command.handler";
import { UpdateProductCategoryCommandHandler } from "./application/commands/UpdateProductCategory/UpdateProductCategory.command.handler";
import { ProductService } from "./application/services/Product.service";
import { CreateProductCommandHandler } from "./application/commands/CreateProduct/CreateProduct.command.handler";
import { GetProductByUuidQueryHandler } from "./application/queries/GetProductByUuid/GetProductByUuid.query.handler";
import { GetProductsQueryQueryHandler } from "./application/queries/GetProducts/GetProducts.query.handler";
import { DeleteProductCommandHandler } from "./application/commands/DeleteProduct/DeleteProduct.command.handler";
import { UpdateProductCommandHandler } from "./application/commands/UpdateProduct/UpdateProduct.command.handler";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([ProductCategory, StockProduct]),
    ],
    providers: [
        ProductCategoryRepository,
        StockProductRepository,

        ProductService,
        ProductCategoryService,

        GetProductsQueryQueryHandler,
        GetProductByUuidQueryHandler,

        CreateProductCommandHandler,
        DeleteProductCommandHandler,
        UpdateProductCommandHandler,

        GetProductCategoryByUuidQueryHandler,
        GetProductCategoriesQueryHandler,

        DeleteProductCategoryCommandHandler,
        UpdateProductCategoryCommandHandler,
        CreateProductCategoryCommandHandler,
    ],
    exports: [
        ProductCategoryService,
        ProductService
    ],
    controllers: [stockController]
})
export class StockModule { }