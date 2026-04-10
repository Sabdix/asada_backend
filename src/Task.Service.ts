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

    // Group unsolved checklists by branch uuid
    const branchMap = new Map<
      string,
      {
        branchName: string;
        checklists: {
          checkListName: string;
          userName: string;
          endHour: string;
          date: string;
        }[];
        managerUuids: Set<string>;
      }
    >();

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
        branchMap.set(branchUuid, {
          branchName: history.user.branch.name,
          checklists: [],
          managerUuids: new Set<string>(),
        });
      }

      const entry = branchMap.get(branchUuid)!;
      entry.checklists.push({
        checkListName: history.check_list_user?.checkList?.name ?? 'N/A',
        userName: history.user?.mail ?? 'N/A',
        endHour: history.check_list_user?.endHour ?? '',
        date: format(history.date, 'dd/MM/yyyy'),
      });
      this.logger.log(
        `Checklist "${history.check_list_user?.checkList?.name ?? 'N/A'}" del usuario ${history.user?.mail ?? 'N/A'} agregado a sucursal ${history.user.branch.name}`,
      );

      if (history.user.uuid_user) {
        entry.managerUuids.add(history.user.uuid_user);
      }
    }

    this.logger.log(`Total de sucursales a notificar: ${branchMap.size}`);

    // Send one notification per branch to all its managers
    for (const [branchUuid, branchData] of branchMap) {
      this.logger.log(
        `Procesando sucursal "${branchData.branchName}" (${branchUuid}) con ${branchData.checklists.length} checklists pendientes y ${branchData.managerUuids.size} managers directos`,
      );

      const allManagers: User[] = [];
      for (const managerUuid of branchData.managerUuids) {
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
        this.logger.warn(
          `No se encontraron managers para sucursal "${branchData.branchName}", se omite notificacion`,
        );
        continue;
      }

      const primaryManager = allManagers[0];
      const ccManagers = allManagers
        .slice(1)
        .map((m) => m.mail_alertas)
        .filter(Boolean)
        .join(',');

      this.logger.log(
        `Enviando correo para sucursal "${branchData.branchName}" - To: ${primaryManager.mail_alertas}, CC: ${ccManagers || 'ninguno'}, Checklists pendientes: ${branchData.checklists.length}`,
      );

      await this.sendBranchSummaryMail(
        primaryManager.mail_alertas,
        ccManagers,
        branchData.branchName,
        branchData.checklists,
      );

      this.logger.log(
        `Correo enviado exitosamente para sucursal "${branchData.branchName}"`,
      );
    }

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

  private async sendBranchSummaryMail(
    to: string,
    cc: string,
    branchName: string,
    checklists: {
      checkListName: string;
      userName: string;
      endHour: string;
      date: string;
    }[],
  ) {
    const notificationService: INotificationService =
      new MailNotificationFactory().createNotificationService();

    const notificationDto: MailNotificationDto = {
      cc: 'oficinaxiliar@hotmail.com,adrcoria@gmail.com,spantoja@cinepolis.com',
      dynamicTemplateData: {
        branchName,
        checklists,
        totalPending: checklists.length,
      },
      subject: `Checklists pendientes - Sucursal ${branchName}`,
      templateId: mailJetTemplateIds.NOTIFICATION_CHECKLIST_2,
      to: 'operaxiliar@gmail.com',
    };
    await notificationService.sendNotification(notificationDto);
    return true;
  }
}
