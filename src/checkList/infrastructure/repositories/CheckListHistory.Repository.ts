import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckListHistory } from 'src/checkList/domain/entities/CheckListHistory';

@Injectable()
export class CheckListHistoryRepository extends Repository<CheckListHistory> {
  constructor(@InjectRepository(CheckListHistory) private readonly repo: Repository<CheckListHistory>) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
}