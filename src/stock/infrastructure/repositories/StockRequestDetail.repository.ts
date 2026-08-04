import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockRequestDetail } from 'src/stock/domain/entities/StockRequestDetail.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StockRequestDetailRepository extends Repository<StockRequestDetail> {
  constructor(
    @InjectRepository(StockRequestDetail)
    private readonly repo: Repository<StockRequestDetail>,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
}
