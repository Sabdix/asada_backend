import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockHistory } from 'src/stock/domain/entities/StockHistory.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StockHistoryRepository extends Repository<StockHistory> {
  constructor(@InjectRepository(StockHistory) private readonly repo: Repository<StockHistory>) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
  
}