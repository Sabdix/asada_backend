import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckListGroupCheckList } from 'src/checkList/domain/entities/CheckListGroupCheckList.entity';

@Injectable()
export class CheckListGroupCheckListRepository extends Repository<CheckListGroupCheckList> {
  constructor(
    @InjectRepository(CheckListGroupCheckList)
    private readonly repo: Repository<CheckListGroupCheckList>,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
}
