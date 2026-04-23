import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockEntrances } from 'src/stock/domain/entities/StockEntrances.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StockEntrancesRepository extends Repository<StockEntrances> {
  constructor(@InjectRepository(StockEntrances) private readonly repo: Repository<StockEntrances>) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
  
}