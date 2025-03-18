import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from 'src/branch/domain/entities/Branch.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BranchRepository extends Repository<Branch> {
  constructor(@InjectRepository(Branch) private readonly repo: Repository<Branch>) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
  
}