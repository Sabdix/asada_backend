import { Injectable } from '@nestjs/common';
import { StockHistoryType } from 'src/stock/domain/enums/StockHistoryType.enum';
import { StockEntrancesRepository } from 'src/stock/infrastructure/repositories/StockEntrances.repository';

@Injectable()
export class StockEntrancesService {
    constructor(private readonly stockEntrnaceRepository: StockEntrancesRepository) { }

    creteStockEntrance(uuid_branch: string, uuid_user: string, uuid_stock: string, quantity: number) {
        return this.stockEntrnaceRepository.save(
            this.stockEntrnaceRepository.create({
                uuid_branch: uuid_branch,
                uuid_user: uuid_user,
                uuid_stock: uuid_stock,
                quantity: quantity
            })
        )
    }

    async getTodayEntrances(uuid_branch: string, uuid_user: string, uuid_stock: string) {
        const result = await this.stockEntrnaceRepository
            .createQueryBuilder('stockEntrance')
            .leftJoin(
                'stockEntrance.branch',
                'branch',
                'branch.deletedAt IS NOT NULL OR branch.deletedAt IS NULL'
            )
            .leftJoin(
                'stockEntrance.user',
                'user',
                'user.deletedAt IS NOT NULL OR user.deletedAt IS NULL'
            )
            .leftJoin(
                'stockEntrance.stock',
                'stock',
                'stock.deletedAt IS NOT NULL OR stock.deletedAt IS NULL'
            )
            .select('SUM(stockEntrance.quantity)', 'total')
            .andWhere('stockEntrance.deletedAt IS NULL')
            .andWhere('branch.uuid = :uuid_branch', { uuid_branch })
            .andWhere('user.uuid = :uuid_user', { uuid_user })
            .andWhere('stock.uuid = :uuid_stock', { uuid_stock })
            .andWhere('stockEntrance.createdAt >= CURRENT_DATE')
            .getRawOne();

        return result ? Number(result.total) : 0;
    }
}
