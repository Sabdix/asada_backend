import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckListItemCriteriaAnswers } from 'src/checkList/domain/entities/CheckListItemCriteriaAnswers.entity';

@Injectable()
export class CheckListItemCriteriaAnswerRepository extends Repository<CheckListItemCriteriaAnswers> {
  constructor(@InjectRepository(CheckListItemCriteriaAnswers) private readonly repo: Repository<CheckListItemCriteriaAnswers>) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
}