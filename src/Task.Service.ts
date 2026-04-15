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

  @Cron(CronExpression.EVERY_2_HOURS)
  // @Cron(CronExpression.EVERY_30_SECONDS)
  async handleNotifyUnsolvedCheckList() {
    this.logger.log(
      'Inicia ejecucion del cronjob de alertamiento de checklists',
    );

    const checkListToNotify =
      await this.checkListHistoryService.getCheckListHistoryToNotify();
    this.logger.log(
      `Se encontraron ${checkListToNotify.length} checklists pendientes por notificar`,
    );

    if (checkListToNotify.length === 0) {
      this.logger.log('No hay checklists pendientes, se omite envio de correo');
      return;
    }

    // Group unsolved checklists by branch
    const branches: {
      branchName: string;
      checklists: {
        checkListName: string;
        branchName: string;
        userName: string;
        endHour: string;
        date: string;
      }[];
    }[] = [];

    const branchMap = new Map<string, number>(); // branchUuid -> index in branches array
    const allManagerUuids = new Set<string>();

    for (const history of checkListToNotify) {
      const branchUuid = history.user?.branch?.uuid;
      if (!branchUuid) {
        this.logger.warn(
          `Checklist history ${history.uuid} no tiene sucursal asociada, se omite`,
        );
        continue;
      }

      if (!branchMap.has(branchUuid)) {
        this.logger.log(
          `Nueva sucursal detectada: ${history.user.branch.name} (${branchUuid})`,
        );
        branchMap.set(branchUuid, branches.length);
        branches.push({
          branchName: history.user.branch.name,
          checklists: [],
        });
      }

      const entry = branches[branchMap.get(branchUuid)!];
      entry.checklists.push({
        checkListName: `${history.user.branch.name ?? 'N/A'} | ${history.check_list_user?.checkList?.name ?? 'N/A'}`,
        branchName: history.user.branch.name,
        userName: history.user?.mail ?? 'N/A',
        endHour: history.check_list_user?.endHour ?? '',
        date: format(history.date, 'dd/MM/yyyy'),
      });
      this.logger.log(
        `Checklist "${history.check_list_user?.checkList?.name ?? 'N/A'}" del usuario ${history.user?.mail ?? 'N/A'} agregado a sucursal ${history.user.branch.name}`,
      );

      if (history.user.uuid_user) {
        allManagerUuids.add(history.user.uuid_user);
      }
    }

    const totalPending = branches.reduce(
      (sum, b) => sum + b.checklists.length,
      0,
    );
    this.logger.log(
      `Total: ${totalPending} checklists pendientes en ${branches.length} sucursales, ${allManagerUuids.size} managers directos`,
    );

    // Collect all unique managers across all branches
    const allManagers: User[] = [];
    for (const managerUuid of allManagerUuids) {
      const chain = await this.getListOfManagers(managerUuid);
      this.logger.log(
        `Cadena de managers para uuid ${managerUuid}: ${chain.map((m) => m.mail_alertas).join(' -> ')}`,
      );
      for (const mgr of chain) {
        if (!allManagers.some((m) => m.uuid === mgr.uuid)) {
          allManagers.push(mgr);
        }
      }
    }

    if (allManagers.length === 0) {
      this.logger.warn('No se encontraron managers, se omite notificacion');
      return;
    }

    const primaryManager = allManagers[0];
    const ccManagers = allManagers
      .slice(1)
      .map((m) => m.mail_alertas)
      .filter(Boolean)
      .join(',');

    this.logger.log(
      `Enviando correo unico - To: ${primaryManager.mail_alertas}, CC: ${ccManagers || 'ninguno'}, Total pendientes: ${totalPending}`,
    );

    await this.sendSummaryMail(
      primaryManager.mail_alertas,
      ccManagers,
      branches,
      totalPending,
    );

    this.logger.log('Correo enviado exitosamente');
    this.logger.log(
      'Finaliza ejecucion del cronjob de alertamiento de checklists',
    );
  }

  private async getListOfManagers(uuidUser: string, managers: User[] = []) {
    const manager = await this.userService.getUserByUuid(uuidUser);
    if (!manager) return managers;

    managers.push(manager);

    if (manager.uuid_user)
      await this.getListOfManagers(manager.uuid_user, managers);
    return managers;
  }

  private async sendSummaryMail(
    to: string,
    cc: string,
    branches: {
      branchName: string;
      checklists: {
        checkListName: string;
        branchName: string;
        userName: string;
        endHour: string;
        date: string;
      }[];
    }[],
    totalPending: number,
  ) {
    const notificationService: INotificationService =
      new MailNotificationFactory().createNotificationService();

    const notificationDto: MailNotificationDto = {
      cc: cc,
      dynamicTemplateData: {
        branches,
        totalPending,
      },
      subject: `Checklists pendientes - ${totalPending} sin contestar`,
      templateId: mailJetTemplateIds.NOTIFICATION_CHECKLIST_2,
      to: to,
    };
    await notificationService.sendNotification(notificationDto);
    return true;
  }
}
