import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from 'src/schedule/domain/entities/Schedule.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleRepository extends Repository<Schedule> {
  constructor(@InjectRepository(Schedule) private readonly repo: Repository<Schedule>) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
  
}