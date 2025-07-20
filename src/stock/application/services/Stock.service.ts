import { Injectable } from '@nestjs/common';
import { StockProductRepository } from 'src/stock/infrastructure/repositories/StockProduct.repository';
import { CreateProductRequestDto } from '../dtos/CreateProductRequest.dto';
import { StockProduct } from 'src/stock/domain/entities/StockProduct.entity';
import { StockRepository } from 'src/stock/infrastructure/repositories/Stock.repository';
import { CreateStockRequestDto } from '../dtos/CreateStock.dto';
import { Stock } from 'src/stock/domain/entities/Stock.entity';


@Injectable()
export class StockService {
    constructor(private readonly stockRepository: StockRepository) { }

    creteStock(request: CreateStockRequestDto) {
        return this.stockRepository.save(
            this.stockRepository.create({
                uuid_category: request.uuid_category,
                uuid_product: request.uuid_product,
                uuid_branch: request.uuid_branch,
                quantity: request.quantity,
                requiredStock: request.requiredStock,
                holidayRequiredStock: request.holidayRequiredStock
            })
        )
    }

    getStockByBranch(uuid_branch: string) {
        return this.stockRepository
            .createQueryBuilder('stock')
            .leftJoinAndSelect(
                'stock.category',
                'category',
                'category.deletedAt IS NOT NULL OR category.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'stock.product',
                'product',
                'product.deletedAt IS NOT NULL OR product.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'stock.branch',
                'branch',
                'branch.deletedAt IS NOT NULL OR branch.deletedAt IS NULL'
            )
            .where('stock.uuid_branch = :uuid_branch', { uuid_branch })
            .andWhere('product.deletedAt IS NULL')
            .getMany();
    }

    getStockByUuid(uuid: string) {
        return this.stockRepository
            .createQueryBuilder('stock')
            .leftJoinAndSelect(
                'stock.category',
                'category',
                'category.deletedAt IS NOT NULL OR category.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'stock.product',
                'product',
                'product.deletedAt IS NOT NULL OR product.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'stock.branch',
                'branch',
                'branch.deletedAt IS NOT NULL OR branch.deletedAt IS NULL'
            )
            .where('stock.uuid = :uuid', { uuid })
            .andWhere('stock.deletedAt IS NULL')
            .getOne();
    }

    getStocks() {
        return this.stockRepository
            .createQueryBuilder('stock')
            .leftJoinAndSelect(
                'stock.category',
                'category',
                'category.deletedAt IS NOT NULL OR category.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'stock.product',
                'product',
                'product.deletedAt IS NOT NULL OR product.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'stock.branch',
                'branch',
                'branch.deletedAt IS NOT NULL OR branch.deletedAt IS NULL'
            )
            .andWhere('product.deletedAt IS NULL')
            .getMany();
    }

    getStocksPaginated(size:number, offset:number) {
          return this.stockRepository
            .createQueryBuilder('stock')
            .leftJoinAndSelect(
                'stock.category',
                'category',
                'category.deletedAt IS NOT NULL OR category.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'stock.product',
                'product',
                'product.deletedAt IS NOT NULL OR product.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'stock.branch',
                'branch',
                'branch.deletedAt IS NOT NULL OR branch.deletedAt IS NULL'
            )
            .andWhere('product.deletedAt IS NULL')
            .take(size)
            .skip(offset)
            .getManyAndCount();
    }

    deleteStock(uuid: string) {
        return this.stockRepository.softDelete({ uuid: uuid });
    }

    updateStock(stock: Stock) {
        return this.stockRepository.save(stock);
    }

}
