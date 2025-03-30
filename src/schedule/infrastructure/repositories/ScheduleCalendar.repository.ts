import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduleCalendar } from 'src/schedule/domain/entities/ScheduleCalendar.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleCalendarRepository extends Repository<ScheduleCalendar> {
  constructor(@InjectRepository(ScheduleCalendar) private readonly repo: Repository<ScheduleCalendar>) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
  
}