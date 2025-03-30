import { Injectable } from '@nestjs/common';
import { ScheduleRepository } from 'src/schedule/infrastructure/repositories/Schedule.repository';
import { CreateScheduleRequestDto } from '../dtos/CreateScheduleRequest.dto';
import { Schedule } from 'src/schedule/domain/entities/Schedule.entity';

@Injectable()
export class ScheduleService {
    constructor(private readonly scheduleRepository: ScheduleRepository) { }

    creteSchedule(request: CreateScheduleRequestDto) {
        return this.scheduleRepository.save(
            this.scheduleRepository.create({
                name: request.name
            })
        )
    }

    getScheduleByName(name: string) {
        return this.scheduleRepository.findOneBy({ name: name });
    }

    getScheduleByUuid(uuid: string) {
        return this.scheduleRepository.findOneBy({ uuid: uuid });
    }

    getScheudules() {
        return this.scheduleRepository.find();
    }

    deleteSchedule(uuid: string) {
        return this.scheduleRepository.softDelete({ uuid: uuid });
    }

    UpdateSchedule(schedule: Schedule) {
        return this.scheduleRepository.save(schedule);
    }
}
