import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateProductCommand } from "src/stock/application/commands/CreateProduct/CreateProduct.command";
import { CreateProductCategoryCommand } from "src/stock/application/commands/CreateProductCategory/CreateProductCategory.command";
import { CreateStockCommand } from "src/stock/application/commands/CreateStock/CreateStock.command";
import { DeleteProductCommand } from "src/stock/application/commands/DeleteProduct/DeleteProduct.command";
import { DeleteProductCategoryCommand } from "src/stock/application/commands/DeleteProductCategory/DeleteProductCategory.command";
import { DeleteStockCommand } from "src/stock/application/commands/DeleteStock/DeleteStock.command";
import { UpdateProductCommand } from "src/stock/application/commands/UpdateProduct/UpdateProduct.command";
import { UpdateProductCategoryCommand } from "src/stock/application/commands/UpdateProductCategory/UpdateProductCategory.command";
import { UpdateStockCommand } from "src/stock/application/commands/UpdateStock/UpdateStock.command";
import { ValidateStockCommand } from "src/stock/application/commands/ValidateStock/ValidateStock.command";
import { CreateProductCategoryRequestDto } from "src/stock/application/dtos/CreateProductCategory.dto";
import { CreateProductRequestDto } from "src/stock/application/dtos/CreateProductRequest.dto";
import { CreateStockRequestDto } from "src/stock/application/dtos/CreateStock.dto";
import { UpdateProductCategoryRequestDto } from "src/stock/application/dtos/UpdateProductCategoryRequest.dto";
import { UpdateProductRequestDto } from "src/stock/application/dtos/UpdateProductRequest.dto";
import { UpdateStockRequestDto } from "src/stock/application/dtos/UpdateStockRequest.dto";
import { ValidateStockRequestDto } from "src/stock/application/dtos/ValidateStockRequest.dto";
import { GetProductCategoriesQuery } from "src/stock/application/queries/GerProductCategories/GetProductCategories.query";
import { GetProductByUuidQuery } from "src/stock/application/queries/GetProductByUuid/GetProductByUuid.query";
import { GetProductCategoryByUuidQuery } from "src/stock/application/queries/GetProductCategoryByUuid/GetProductCategoryByUuid.query";
import { GetProductsQuery } from "src/stock/application/queries/GetProducts/GetProducts.query";
import { GetStockByBranchQuery } from "src/stock/application/queries/GetStockByBranch/GetStockByBranch.query";
import { GetStockByUuidQuery } from "src/stock/application/queries/GetStockByUuid/GetStockByUuid.query";
import { GetStocksQuery } from "src/stock/application/queries/GetStocks/GetStocks.query";
import { DownloadStockReportQuery } from "src/stock/application/queries/DownloadStockReport/DownloadStockReport.query";



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
    async getProducts(@Query('size') size: number, @Query('offset') offset: number) {
        return this.queryBus.execute(new GetProductsQuery(size, offset));
    }

    @Delete('product/:uuid')
    async deleteProduct(@Param('uuid') uuid: string) {
        return this.commandBus.execute(new DeleteProductCommand(uuid));
    }

    @Put('product/:uuid')
    async UpdateProduct(@Param('uuid') uuid: string, @Body() request: UpdateProductRequestDto) {
        return this.commandBus.execute(new UpdateProductCommand(request, uuid));
    }

    @Post('create')
    async createProductStock(@Body() createStockRequestDto: CreateStockRequestDto) {
        return this.commandBus.execute(new CreateStockCommand(createStockRequestDto));
    }

    @Get()
    async getStocks(@Query('size') size: number, @Query('offset') offset: number) {
        return this.queryBus.execute(new GetStocksQuery(size, offset));
    }

    @Get('by-branch/:uuid')
    async getStockByBranch(@Param('uuid') uuid: string, @Query('size') size: number, @Query('offset') offset: number) {
        return this.queryBus.execute(new GetStockByBranchQuery(uuid, size, offset));
    }

    @Get('by-uuid/:uuid')
    async getStockByUuid(@Param('uuid') uuid: string) {
        return this.queryBus.execute(new GetStockByUuidQuery(uuid));
    }

    @Delete(':uuid')
    async deleteStock(@Param('uuid') uuid: string) {
        return this.commandBus.execute(new DeleteStockCommand(uuid));
    }

    @Put(':uuid')
    async UpdateStock(@Param('uuid') uuid: string, @Body() request: UpdateStockRequestDto) {
        return this.commandBus.execute(new UpdateStockCommand(request, uuid));
    }

    @Post('validation')
    async validateStock(@Body() validateStockRequestDto: ValidateStockRequestDto) {
        return this.commandBus.execute(new ValidateStockCommand(validateStockRequestDto));
    }

    @Get('report/download')
    async downloadStockHistoryReport(@Query('initialDate') initialDate: Date, @Query('endDate') endDate: Date, @Query('branchId') branchId: string, @Res() res: Response) {
        try {

            const excelBuffer = await this.queryBus.execute(new DownloadStockReportQuery(initialDate, endDate, branchId));

            // Configurar los encabezados de la respuesta
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=reporte.xlsx');

            // Enviar el buffer como respuesta
            res.status(HttpStatus.OK).send(excelBuffer);
        } catch (error) {
            console.error('Error al generar el Excel:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error al generar el reporte.');
        }
    }
}
