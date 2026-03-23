import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CheckListUserService } from './checkList/application/services/checkListUser.service';
import { CreateCheckListHistoryRequestDto } from './checkList/application/dtos/CreateCheckListHistoryRequest.dto';
import { CheckListHistoryService } from './checkList/application/services/checkListHistory.service';
import { format, startOfDay, subMinutes } from 'date-fns';
import { UserService } from './user/application/services/user.service';
import { User } from './user/domain/entities/User.entity';
import { INotificationService } from './notification/application/interfaces/INotification.service';
import { MailNotificationFactory } from './notification/application/factories/MailNotification.factory';
import { MailNotificationDto } from './notification/application/dto/MailNotification.dto';
import { mailJetTemplateIds } from './notification/domain/enums/templateIds';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    private checkListUserService: CheckListUserService,
    private checkListHistoryService: CheckListHistoryService,
    private userService: UserService,
  ) {
    ((this.checkListUserService = checkListUserService),
      (this.checkListHistoryService = checkListHistoryService));
  }

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  //@Cron("0 48 7 * * *")
  async handleCreateTodayHistory() {
    this.logger.log('Incia ejecucion del cronjob');
    const weekDay = new Date().getDay();
    this.logger.log('Se obtiene el weekday actual: ' + weekDay.toString());

    const today = new Date();

    const checkListOfTheDay =
      await this.checkListUserService.getCheckListByWeekDay(
        weekDay,
        startOfDay(today),
      );
    this.logger.log(
      'Se obtienen todos los checklist a los que se les generará un registro en el historial',
    );

    for (const checkList of checkListOfTheDay) {
      const checkListHistory = new CreateCheckListHistoryRequestDto();
      checkListHistory.status = 0;
      checkListHistory.uuid_check_list = checkList.uuid_check_list;
      checkListHistory.uuid_user = checkList.uuid_user;
      checkListHistory.date = new Date();
      this.logger.log(
        'Se asigna la data previo a la insercion para el registro del checklist user: ' +
          checkList.uuid.toString() +
          ' del usuario: ' +
          checkList.uuid_user.toString(),
      );

      const newHistory =
        await this.checkListHistoryService.creteCheckListHistory(
          checkListHistory,
          checkList,
        );
      this.logger.log(
        'Se inserto con exito el history:  ' +
          newHistory.uuid.toString() +
          ' correspondiente al checklist user: ' +
          checkList.uuid.toString(),
      );
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  //@Cron(CronExpression.EVERY_30_SECONDS)
  async handleNotifyUnsolvedCheckList() {
    this.logger.log(
      'Inicia ejecucion del cronjob de alertamiento de checklists',
    );

    const checkListToNotify =
      await this.checkListHistoryService.getCheckListHistoryToNotify();

    // Group unsolved checklists by branch uuid
    const branchMap = new Map<
      string,
      {
        branchName: string;
        checklists: {
          checkListName: string;
          userName: string;
          endHour: string;
        }[];
        managerUuids: Set<string>;
      }
    >();

    for (const history of checkListToNotify) {
      const branchUuid = history.user?.branch?.uuid;
      if (!branchUuid) continue;

      if (!branchMap.has(branchUuid)) {
        branchMap.set(branchUuid, {
          branchName: history.user.branch.name,
          checklists: [],
          managerUuids: new Set<string>(),
        });
      }

      const entry = branchMap.get(branchUuid)!;
      entry.checklists.push({
        checkListName: history.check_list_user?.checkList?.name ?? 'N/A',
        userName: history.user?.name ?? 'N/A',
        endHour: history.check_list_user?.endHour ?? '',
      });

      if (history.user.uuid_user) {
        entry.managerUuids.add(history.user.uuid_user);
      }
    }

    // Send one notification per branch to all its managers
    for (const [, branchData] of branchMap) {
      const allManagers: User[] = [];
      for (const managerUuid of branchData.managerUuids) {
        const chain = await this.getListOfManagers(managerUuid);
        for (const mgr of chain) {
          if (!allManagers.some((m) => m.uuid === mgr.uuid)) {
            allManagers.push(mgr);
          }
        }
      }

      if (allManagers.length === 0) continue;

      const primaryManager = allManagers[0];
      const ccManagers = allManagers
        .slice(1)
        .map((m) => m.mail_alertas)
        .filter(Boolean)
        .join(',');

      await this.sendBranchSummaryMail(
        primaryManager.mail_alertas,
        ccManagers,
        branchData.branchName,
        branchData.checklists,
      );
    }
  }

  private async getListOfManagers(uuidUser: string, managers: User[] = []) {
    const manager = await this.userService.getUserByUuid(uuidUser);
    if (!manager) return managers;

    managers.push(manager);

    if (manager.uuid_user)
      await this.getListOfManagers(manager.uuid_user, managers);
    return managers;
  }

  private async sendBranchSummaryMail(
    to: string,
    cc: string,
    branchName: string,
    checklists: { checkListName: string; userName: string; endHour: string }[],
  ) {
    const notificationService: INotificationService =
      new MailNotificationFactory().createNotificationService();

    const notificationDto: MailNotificationDto = {
      cc: cc,
      dynamicTemplateData: {
        branchName,
        checklists,
        totalPending: checklists.length,
      },
      subject: `Checklists pendientes - Sucursal ${branchName}`,
      templateId: mailJetTemplateIds.NOTIFICATION_CHECKLIST,
      to: to,
    };
    await notificationService.sendNotification(notificationDto);
    return true;
  }
}
