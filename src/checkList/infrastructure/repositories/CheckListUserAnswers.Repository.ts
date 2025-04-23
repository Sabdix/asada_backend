import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckListUserAnswers } from 'src/checkList/domain/entities/CheckListUserAnswers';
import { Repository } from 'typeorm';

@Injectable()
export class CheckListUserAnswersRepository extends Repository<CheckListUserAnswers> {
  constructor(@InjectRepository(CheckListUserAnswers) private readonly repo: Repository<CheckListUserAnswers>) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
}