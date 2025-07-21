import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkArea } from 'src/user/domain/entities/WorkArea.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorkAreaRepository extends Repository<WorkArea> {
  constructor(@InjectRepository(WorkArea) private readonly repo: Repository<WorkArea>) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
  
}