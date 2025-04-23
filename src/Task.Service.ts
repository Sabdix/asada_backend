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
    const weekDay = new Date().getDay();

    const checkListOfTheDay = await this.checkListUserService.getCheckListByWeekDay(weekDay)

    for (const checkList of checkListOfTheDay) {
      const checkListHistory = new CreateCheckListHistoryRequestDto
      checkListHistory.status = false
      checkListHistory.uuid_check_list = checkList.uuid_check_list
      checkListHistory.uuid_user = checkList.uuid_user
      checkListHistory.date = new Date()

      await this.checkListHistoryService.creteCheckListHistory(checkListHistory,checkList)      
    }

  }
}