import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CheckListUserService } from './checkList/application/services/checkListUser.service';
import { CreateCheckListHistoryRequestDto } from './checkList/application/dtos/CreateCheckListHistoryRequest.dto';
import { CheckListHistoryService } from './checkList/application/services/checkListHistory.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name)
  constructor(
    private checkListUserService: CheckListUserService,
    private checkListHistoryService: CheckListHistoryService,
  ) {
    this.checkListUserService = checkListUserService,
      this.checkListHistoryService = checkListHistoryService
  }



  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  //@Cron(CronExpression.EVERY_30_SECONDS)
  async handleCreateTodayHistory() {
    this.logger.log('Incia ejecucion del cronjob');
    const weekDay = new Date().getDay();
    this.logger.log('Se obtiene el weekday actual: ' + weekDay.toString());

    const checkListOfTheDay = await this.checkListUserService.getCheckListByWeekDay(weekDay)
    this.logger.log('Se obtienen todos los checklist a los que se les generará un registro en el historial');

    for (const checkList of checkListOfTheDay) {
      const checkListHistory = new CreateCheckListHistoryRequestDto
      checkListHistory.status = 0
      checkListHistory.uuid_check_list = checkList.uuid_check_list
      checkListHistory.uuid_user = checkList.uuid_user
      checkListHistory.date = new Date()
      this.logger.log('Se asigana la data previo a la insecion para el registro del checklist user: ' + checkList.uuid.toString() + ' del usuario: ' + checkList.uuid_user.toString());

      const newHistory = await this.checkListHistoryService.creteCheckListHistory(checkListHistory, checkList)
      this.logger.log('Se inserto con exito el history:  ' + newHistory.uuid.toString() + ' correspondiente al checklist user: ' + checkList.uuid.toString());
    }

  }
}