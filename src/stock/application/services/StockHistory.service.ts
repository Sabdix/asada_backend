import { Injectable } from '@nestjs/common';
import { StockHistoryRepository } from 'src/stock/infrastructure/repositories/StockHistory.repository';
import { StockHistoryType } from 'src/stock/domain/enums/StockHistoryType.enum';
import { startOfDay, subHours } from 'date-fns';


@Injectable()
export class StockHistoryService {
    constructor(private readonly stockHistoryRepository: StockHistoryRepository) { }

    creteStock(uuid_stock: string, uuid_user: string, quantity: number, previousQuantity: number, type: StockHistoryType, date: Date, uuid_check_list: string) {
        return this.stockHistoryRepository.save(
            this.stockHistoryRepository.create({
                uuid_stock: uuid_stock,
                uuid_user: uuid_user,
                quantity: quantity,
                previousQuantity: previousQuantity,
                type: type,
                date: date,
                uuid_check_list: uuid_check_list
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
            .leftJoinAndSelect(
                'sh.checklist',
                'cl',
                'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL'
            )
            .where('sh.date BETWEEN :initialDate AND :endDate', { initialDate, endDate })
            .andWhere('sh.deletedAt IS NULL')
            .andWhere('s.uuid_branch = :uuid_branch', { uuid_branch })
            .orderBy('sh.createdAt', "ASC")
            .getMany();
    }

    getTodayStockHistoryByUser(uuid_user: string, uuid_check_list: string) {

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
            .andWhere('sh.uuid_check_list = :uuid_check_list', { uuid_check_list })
            .orderBy('sh.updatedAt', "DESC")
            .getMany();
    }
}
