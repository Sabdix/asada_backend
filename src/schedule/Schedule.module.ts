import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Schedule } from "./domain/entities/Schedule.entity";
import { ScheduleService } from "./application/services/schedule.service";
import { ScheduleRepository } from "./infrastructure/repositories/Schedule.repository";
import { scheduleController } from "./infrastructure/controllers/schedule.controller";
import { GetSchedulesQueryHandler } from "./application/queries/GetSchedules/GetSchedules.query.handler";
import { GetScheduleByUuidQueryHandler } from "./application/queries/GerScheduleByUuid/GetScheduleByUuid.query.handler";
import { CreateScheduleCommandHandler } from "./application/commands/CreateSchedule/CreateSchedule.command.handler";
import { DeleteScheduleCommandHandler } from "./application/commands/DeleteSchedule/DeleteSchedule.command.handler";
import { UpdateScheduleCommandHandler } from "./application/commands/UpdateSchedule/UpdateSchedule.command.handler";
import { CreateScheduleCalendarCommandHandler } from "./application/commands/CreateScheduleCalendar/CreateScheduleCalendar.command.handler";
import { GetScheduleCalendarByScheduleQueryHandler } from "./application/queries/GetSchueduleCalendarBySchedule/GetScheduleCalendarBySchedule.query.handler";
import { DeleteScheduleCalendarCommandHandler } from "./application/commands/DeleteScheduleCalendar/DeleteScheduleCalendar.command.handler";
import { UpdateScheduleCalendarCommandHandler } from "./application/commands/UpdateScheduleCalendar/UpdateScheduleCalendar.command.handler";
import { ScheduleCalendarService } from "./application/services/scheduleCalendar.service";
import { ScheduleCalendar } from "./domain/entities/ScheduleCalendar.entity";
import { ScheduleCalendarRepository } from "./infrastructure/repositories/ScheduleCalendar.repository";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([Schedule,ScheduleCalendar])
    ],
    providers: [
        ScheduleRepository,
        ScheduleCalendarRepository,

        ScheduleService,
        ScheduleCalendarService,

        CreateScheduleCommandHandler,
        DeleteScheduleCommandHandler,
        UpdateScheduleCommandHandler,
        CreateScheduleCalendarCommandHandler,
        DeleteScheduleCalendarCommandHandler,
        UpdateScheduleCalendarCommandHandler,
        
        GetSchedulesQueryHandler,
        GetScheduleByUuidQueryHandler,
        GetScheduleCalendarByScheduleQueryHandler
    ],
    exports: [
        ScheduleService,
        ScheduleCalendarService
    ],
    controllers: [scheduleController]

})
export class ScheduleModule {

}