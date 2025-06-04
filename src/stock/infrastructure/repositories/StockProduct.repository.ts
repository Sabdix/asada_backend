import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockProduct } from 'src/stock/domain/entities/StockProduct.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StockProductRepository extends Repository<StockProduct> {
  constructor(@InjectRepository(StockProduct) private readonly repo: Repository<StockProduct>) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
  
}