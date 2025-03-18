import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckListItemCriteria } from 'src/checkList/domain/entities/CheckListItemCriteria.entity';

@Injectable()
export class CheckListItemCriteriaRepository extends Repository<CheckListItemCriteria> {
  constructor(@InjectRepository(CheckListItemCriteria) private readonly repo: Repository<CheckListItemCriteria>) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
}