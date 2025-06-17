import { Injectable } from '@nestjs/common';
import { StockProductRepository } from 'src/stock/infrastructure/repositories/StockProduct.repository';
import { CreateProductRequestDto } from '../dtos/CreateProductRequest.dto';
import { StockProduct } from 'src/stock/domain/entities/StockProduct.entity';
import { StockRepository } from 'src/stock/infrastructure/repositories/Stock.repository';
import { CreateStockRequestDto } from '../dtos/CreateStock.dto';
import { Stock } from 'src/stock/domain/entities/Stock.entity';
import { StockHistoryRepository } from 'src/stock/infrastructure/repositories/StockHistory.repository';
import { ValidateStockRequestDto } from '../dtos/ValidateStockRequest.dto';
import { StockHistoryType } from 'src/stock/domain/enums/StockHistoryType.enum';


@Injectable()
export class StockHistoryService {
    constructor(private readonly stockHistoryRepository: StockHistoryRepository) { }

    creteStock(uuid_stock: string, uuid_user: string, quantity: number, previousQuantity: number, type: StockHistoryType, date: Date) {
        return this.stockHistoryRepository.save(
            this.stockHistoryRepository.create({
                uuid_stock: uuid_stock,
                uuid_user: uuid_user,
                quantity: quantity,
                previousQuantity: previousQuantity,
                type: type,
                date: date
            })
        )
    }

}
