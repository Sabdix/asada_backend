import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BranchReview } from 'src/branch/domain/entities/BranchReview.entity';

@Injectable()
export class BranchReviewRepository extends Repository<BranchReview> {
  constructor(@InjectRepository(BranchReview) private readonly repo: Repository<BranchReview>) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
  
}