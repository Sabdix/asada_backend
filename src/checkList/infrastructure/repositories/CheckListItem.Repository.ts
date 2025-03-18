import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckListItem } from 'src/checkList/domain/entities/CheckListItem.entity';

@Injectable()
export class CheckListItemRepository extends Repository<CheckListItem> {
  constructor(@InjectRepository(CheckListItem) private readonly repo: Repository<CheckListItem>) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
}