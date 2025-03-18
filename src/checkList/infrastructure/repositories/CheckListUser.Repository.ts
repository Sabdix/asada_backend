import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckListUser } from 'src/checkList/domain/entities/CheckListUser.entity';

@Injectable()
export class CheckListUserRepository extends Repository<CheckListUser> {
  constructor(@InjectRepository(CheckListUser) private readonly repo: Repository<CheckListUser>) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
}