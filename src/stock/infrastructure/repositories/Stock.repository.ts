import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from 'src/stock/domain/entities/Stock.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StockRepository extends Repository<Stock> {
  constructor(@InjectRepository(Stock) private readonly repo: Repository<Stock>) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
  
}