import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckList } from 'src/checkList/domain/entities/CheckList.entity';

@Injectable()
export class CheckListRepository extends Repository<CheckList> {
  constructor(@InjectRepository(CheckList) private readonly repo: Repository<CheckList>) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
}