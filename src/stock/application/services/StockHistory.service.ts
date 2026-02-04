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
import { startOfDay, subHours } from 'date-fns';


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

    getBranchStockHistoryByRangeTime(initialDate: Date, endDate: Date, uuid_branch: string) {

        return this.stockHistoryRepository
            .createQueryBuilder('sh')
            .leftJoinAndSelect(
                'sh.stock',
                's',
                's.deletedAt IS NOT NULL OR s.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                's.branch',
                'b',
                'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'sh.user',
                'u',
                'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                's.product',
                'p',
                'p.deletedAt IS NOT NULL OR p.deletedAt IS NULL'
            )
            .where('sh.date BETWEEN :initialDate AND :endDate', { initialDate, endDate })
            .andWhere('sh.deletedAt IS NULL')
            .andWhere('s.uuid_branch = :uuid_branch', { uuid_branch })
            .getMany();
    }

    getTodayStockHistoryByUser(uuid_user: string) {

        return this.stockHistoryRepository
            .createQueryBuilder('sh')
            .leftJoinAndSelect(
                'sh.stock',
                's',
                's.deletedAt IS NOT NULL OR s.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                's.product',
                'p',
                'p.deletedAt IS NOT NULL OR p.deletedAt IS NULL'
            )
            .andWhere('sh.deletedAt IS NULL')
            .andWhere('sh.uuid_user = :uuid_user', { uuid_user })
            .andWhere('sh.date = :today',{ today: startOfDay(subHours(new Date(),6)) })
            .getMany();
    }
}
