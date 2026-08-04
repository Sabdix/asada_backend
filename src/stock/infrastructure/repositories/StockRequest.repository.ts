import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockRequest } from 'src/stock/domain/entities/StockRequest.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StockRequestRepository extends Repository<StockRequest> {
  constructor(
    @InjectRepository(StockRequest)
    private readonly repo: Repository<StockRequest>,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
}
