import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckListGroup } from 'src/checkList/domain/entities/CheckListGroup.entity';

@Injectable()
export class CheckListGroupRepository extends Repository<CheckListGroup> {
  constructor(
    @InjectRepository(CheckListGroup)
    private readonly repo: Repository<CheckListGroup>,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
}
