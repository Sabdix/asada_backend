import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateProductCommand } from "src/stock/application/commands/CreateProduct/CreateProduct.command";
import { CreateProductCategoryCommand } from "src/stock/application/commands/CreateProductCategory/CreateProductCategory.command";
import { DeleteProductCommand } from "src/stock/application/commands/DeleteProduct/DeleteProduct.command";
import { DeleteProductCategoryCommand } from "src/stock/application/commands/DeleteProductCategory/DeleteProductCategory.command";
import { UpdateProductCommand } from "src/stock/application/commands/UpdateProduct/UpdateProduct.command";
import { UpdateProductCategoryCommand } from "src/stock/application/commands/UpdateProductCategory/UpdateProductCategory.command";
import { CreateProductCategoryRequestDto } from "src/stock/application/dtos/CreateProductCategory.dto";
import { CreateProductRequestDto } from "src/stock/application/dtos/CreateProductRequest.dto";
import { UpdateProductCategoryRequestDto } from "src/stock/application/dtos/UpdateProductCategoryRequest.dto";
import { UpdateProductRequestDto } from "src/stock/application/dtos/UpdateProductRequest.dto";
import { GetProductCategoriesQuery } from "src/stock/application/queries/GerProductCategories/GetProductCategories.query";
import { GetProductByUuidQuery } from "src/stock/application/queries/GetProductByUuid/GetProductByUuid.query";
import { GetProductCategoryByUuidQuery } from "src/stock/application/queries/GetProductCategoryByUuid/GetProductCategoryByUuid.query";
import { GetProductsQuery } from "src/stock/application/queries/GetProducts/GetProducts.query";



@Controller('stock')
export class stockController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) { }

    @Post('product/category/create')
    async createProductCategory(@Body() createProductCategoryRequestDto: CreateProductCategoryRequestDto) {
        return this.commandBus.execute(new CreateProductCategoryCommand(createProductCategoryRequestDto));
    }

    @Get('product/category/:uuid')
    async getProductCategoryByUuid(@Param('uuid') uuid: string) {
        return this.queryBus.execute(new GetProductCategoryByUuidQuery(uuid));
    }

    @Get('/product/categories')
    async getProductCategories() {
        return this.queryBus.execute(new GetProductCategoriesQuery());
    }

    @Delete('product/category/:uuid')
    async deleteProductCategory(@Param('uuid') uuid: string) {
        return this.commandBus.execute(new DeleteProductCategoryCommand(uuid));
    }

    @Put('product/category/:uuid')
    async UpdateProductCategory(@Param('uuid') uuid: string, @Body() request: UpdateProductCategoryRequestDto) {
        return this.commandBus.execute(new UpdateProductCategoryCommand(request, uuid));
    }

    @Post('product/create')
    async createProduct(@Body() createProductRequestDto: CreateProductRequestDto) {
        return this.commandBus.execute(new CreateProductCommand(createProductRequestDto));
    }

    @Get('product/by-uuid/:uuid')
    async getProductByUuid(@Param('uuid') uuid: string) {
        return this.queryBus.execute(new GetProductByUuidQuery(uuid));
    }

    @Get('/product')
    async getProducts() {
        return this.queryBus.execute(new GetProductsQuery());
    }

    @Delete('product/:uuid')
    async deleteProduct(@Param('uuid') uuid: string) {
        return this.commandBus.execute(new DeleteProductCommand(uuid));
    }

    @Put('product/:uuid')
    async UpdateProduct(@Param('uuid') uuid: string, @Body() request: UpdateProductRequestDto) {
        return this.commandBus.execute(new UpdateProductCommand(request, uuid));
    }
}
