import { Injectable, Logger } from '@nestjs/common';
import { CheckListHistoryRepository } from 'src/checkList/infrastructure/repositories/CheckListHistory.Repository';
import { CreateCheckListHistoryRequestDto } from '../dtos/CreateCheckListHistoryRequest.dto';
import { CheckListUser } from 'src/checkList/domain/entities/CheckListUser.entity';
import { CheckListHistory } from 'src/checkList/domain/entities/CheckListHistory';
import {
  endOfDay,
  format,
  startOfDay,
  subDays,
  subHours,
  subMinutes,
} from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { User } from 'src/user/domain/entities/User.entity';

@Injectable()
export class CheckListHistoryService {
  private readonly logger = new Logger(CheckListHistoryService.name);
  constructor(
    private readonly chekListHistoryRepository: CheckListHistoryRepository,
  ) {}

  creteCheckListHistory(
    request: CreateCheckListHistoryRequestDto,
    checkListUser: CheckListUser,
  ) {
    return this.chekListHistoryRepository.save(
      this.chekListHistoryRepository.create({
        status: request.status,
        date: request.date,
        uuid_check_list: request.uuid_check_list,
        uuid_user: request.uuid_user,
        check_list_user: checkListUser,
      }),
    );
  }

  getCheckListHistoyByUuidAndUser(uuid: string, uuid_user) {
    return this.chekListHistoryRepository.findOne({
      where: { uuid: uuid, uuid_user: uuid_user },
      relations: ['check_list'],
    });
  }

  getAllCheckListHistory() {
    // return this.chekListHistoryRepository.find({ relations: ["check_list_user", 'check_list_user.checkList', 'user', 'user.branch'], withDeleted: true });
    const now = new Date();
    const mexicoCityTime = toZonedTime(now, 'America/Mexico_City');
    return this.chekListHistoryRepository
      .createQueryBuilder('clh')
      .leftJoinAndSelect(
        'clh.check_list_user',
        'clu',
        'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clu.checkList',
        'cl',
        'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clh.user',
        'u',
        'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'u.branch',
        'b', // Alias para Branch
        'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'u.manager',
        'm', // Alias para Manager
        'm.deletedAt IS NOT NULL OR m.deletedAt IS NULL',
      )
      .where('clh.deletedAt IS NULL')
      .andWhere('clh.date = :today', {
        today: format(mexicoCityTime, 'yyyy-MM-dd'),
      })
      .getMany();
  }

  getAllCheckListHistoryPaginated(
    size: number,
    offset: number,
    name: string,
    lastName: string,
    secondLastName: string,
    checkList: string,
    branch: string,
  ) {
    // return this.chekListHistoryRepository.find({ relations: ["check_list_user", 'check_list_user.checkList', 'user', 'user.branch'], withDeleted: true });

    // return this.chekListHistoryRepository
    //     .createQueryBuilder('clh')
    //     .leftJoinAndSelect(
    //         'clh.check_list_user',
    //         'clu',
    //         'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL'
    //     )
    //     .leftJoinAndSelect(
    //         'clu.checkList',
    //         'cl',
    //         'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL'
    //     )
    //     .leftJoinAndSelect(
    //         'clh.user',
    //         'u',
    //         'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL'
    //     )
    //     .leftJoinAndSelect(
    //         'u.branch',
    //         'b', // Alias para Branch
    //         'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL'
    //     )
    //     .leftJoinAndSelect(
    //         'u.manager',
    //         'm', // Alias para Manager
    //         'm.deletedAt IS NOT NULL OR m.deletedAt IS NULL'
    //     )
    //     .where('clh.deletedAt IS NULL')
    //     .skip(offset)
    //     .take(size)
    //     .getManyAndCount();
    const now = new Date();
    const mexicoCityTime = toZonedTime(now, 'America/Mexico_City');

    const queryBuilder = this.chekListHistoryRepository
      .createQueryBuilder('clh')
      .leftJoinAndSelect(
        'clh.check_list_user',
        'clu',
        'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clu.checkList',
        'cl',
        'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clh.user',
        'u',
        'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'u.branch',
        'b', // Alias para Branch
        'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'u.manager',
        'm', // Alias para Manager
        'm.deletedAt IS NOT NULL OR m.deletedAt IS NULL',
      )
      .where('clh.deletedAt IS NULL')
      .andWhere('clh.date = :today', {
        today: format(mexicoCityTime, 'yyyy-MM-dd'),
      });

    if (name) {
      queryBuilder.andWhere(`LOWER(u.name) LIKE LOWER(:name)`, {
        name: `%${name}%`,
      });
    }
    if (lastName) {
      queryBuilder.andWhere(`LOWER(u.last_name) LIKE LOWER(:lastName)`, {
        lastName: `%${lastName}%`,
      });
    }
    if (secondLastName) {
      queryBuilder.andWhere(
        `LOWER(u.second_last_name) LIKE LOWER(:secondLastName)`,
        { secondLastName: `%${secondLastName}%` },
      );
    }
    if (checkList) {
      queryBuilder.andWhere(`LOWER(cl.name) LIKE LOWER(:checkList)`, {
        checkList: `%${checkList}%`,
      });
    }
    if (branch) {
      queryBuilder.andWhere(`LOWER(b.name) LIKE LOWER(:branch)`, {
        branch: `%${branch}%`,
      });
    }

    queryBuilder.take(size).skip(offset);

    return queryBuilder.getManyAndCount();
  }

  getCheckListHistoryByUser(uuid_user: string) {
    // return this.chekListHistoryRepository.find({ where: { uuid_user: uuid }, relations: ["check_list_user", 'check_list_user.checkList'], withDeleted: true });
    const now = new Date();
    const mexicoCityTime = toZonedTime(now, 'America/Mexico_City');
    return this.chekListHistoryRepository
      .createQueryBuilder('clh')
      .leftJoinAndSelect(
        'clh.check_list_user',
        'clu',
        'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clu.checkList',
        'cl',
        'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL',
      )
      .where('clh.uuid_user = :uuid_user', { uuid_user })
      .andWhere('clh.date = :today', { today: startOfDay(mexicoCityTime) })
      .andWhere('clh.deletedAt IS NULL')
      .getMany();
  }

  getCheckListHistoryByUserAndGroup(uuid_user: string, uuid_group: string) {
    const now = new Date();
    const mexicoCityTime = toZonedTime(now, 'America/Mexico_City');
    return this.chekListHistoryRepository
      .createQueryBuilder('clh')
      .leftJoinAndSelect(
        'clh.check_list_user',
        'clu',
        'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clu.checkList',
        'cl',
        'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL',
      )
      .innerJoin(
        'check_list_group_check_list',
        'clgcl',
        'clgcl.uuid_check_list = cl.uuid',
      )
      .where('clh.uuid_user = :uuid_user', { uuid_user })
      .andWhere('clgcl.uuid_check_list_group = :uuid_group', { uuid_group })
      .andWhere('clh.date = :today', { today: startOfDay(mexicoCityTime) })
      .andWhere('clh.deletedAt IS NULL')
      .orderBy('clgcl.priority', 'ASC')
      .getMany();
  }

  getCheckListHistoryByUserManagerAndGroup(
    uuid_user: string,
    uuid_group: string,
  ) {
    const now = new Date();
    const mexicoCityTime = toZonedTime(now, 'America/Mexico_City');
    return this.chekListHistoryRepository
      .createQueryBuilder('clh')
      .leftJoinAndSelect(
        'clh.check_list_user',
        'clu',
        'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clu.user',
        'u',
        'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clu.checkList',
        'cl',
        'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL',
      )
      .innerJoin(
        'check_list_group_check_list',
        'clgcl',
        'clgcl.uuid_check_list = cl.uuid',
      )
      .where('u.uuid_user = :uuid_user', { uuid_user })
      .andWhere('clgcl.uuid_check_list_group = :uuid_group', { uuid_group })
      .andWhere('clh.date = :today', { today: startOfDay(mexicoCityTime) })
      .andWhere('clh.deletedAt IS NULL')
      .orderBy('clgcl.priority', 'ASC')
      .getMany();
  }

  getCheckListHistoryByBranchAndGroup(uuid_branch: string, uuid_group: string) {
    const now = new Date();
    const mexicoCityTime = toZonedTime(now, 'America/Mexico_City');
    return this.chekListHistoryRepository
      .createQueryBuilder('clh')
      .leftJoinAndSelect(
        'clh.check_list_user',
        'clu',
        'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clu.user',
        'u',
        'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clu.checkList',
        'cl',
        'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL',
      )
      .innerJoin(
        'check_list_group_check_list',
        'clgcl',
        'clgcl.uuid_check_list = cl.uuid',
      )
      .where('u.uuid_branch = :uuid_branch', { uuid_branch })
      .andWhere('clgcl.uuid_check_list_group = :uuid_group', { uuid_group })
      .andWhere('clh.date = :today', { today: startOfDay(mexicoCityTime) })
      .andWhere('clh.deletedAt IS NULL')
      .orderBy('clgcl.priority', 'ASC')
      .getMany();
  }

  getCheckListHistoryByUuid(uuid: string) {
    return this.chekListHistoryRepository.findOne({
      where: { uuid: uuid },
      relations: ['check_list'],
    });
  }

  UpdateCheckListHistoryByUuid(history: CheckListHistory) {
    return this.chekListHistoryRepository.save(history);
  }

  getCheckListHistoryByRangeTime(initialDate: Date, endDate: Date) {
    // return this.chekListHistoryRepository.find({
    //     where: { date: Between(initialDate, endDate) },
    //     relations: ["check_list_user", 'check_list_user.checkList', 'user', 'user.branch'], withDeleted: true
    // });

    return this.chekListHistoryRepository
      .createQueryBuilder('clh')
      .leftJoinAndSelect(
        'clh.check_list_user',
        'clu',
        'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clu.checkList',
        'cl',
        'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clh.user',
        'u',
        'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'u.branch',
        'b',
        'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL',
      )
      .where('clh.date BETWEEN :initialDate AND :endDate', {
        initialDate,
        endDate,
      })
      .andWhere('clh.deletedAt IS NULL')
      .getMany();
  }

  getBranchCheckListHistoryByRangeTime(
    initialDate: Date,
    endDate: Date,
    uuid_branch: string,
  ) {
    // return this.chekListHistoryRepository.find({
    //     where: { date: Between(initialDate, endDate) },
    //     relations: ["check_list_user", 'check_list_user.checkList', 'user', 'user.branch'], withDeleted: true
    // });

    return this.chekListHistoryRepository
      .createQueryBuilder('clh')
      .leftJoinAndSelect(
        'clh.check_list_user',
        'clu',
        'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clu.checkList',
        'cl',
        'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clh.user',
        'u',
        'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'u.branch',
        'b',
        'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL',
      )
      .where('clh.date BETWEEN :initialDate AND :endDate', {
        initialDate,
        endDate,
      })
      .andWhere('clh.deletedAt IS NULL')
      .andWhere('u.uuid_branch = :uuid_branch', { uuid_branch })
      .getMany();
  }

  getCheckListHistoryByBranch(uuid_branch: string) {
    // return this.chekListHistoryRepository.find({ relations: ["check_list_user", 'check_list_user.checkList', 'user', 'user.branch'], withDeleted: true });
    const now = new Date();
    const mexicoCityTime = toZonedTime(now, 'America/Mexico_City');
    return this.chekListHistoryRepository
      .createQueryBuilder('clh')
      .leftJoinAndSelect(
        'clh.check_list_user',
        'clu',
        'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clu.checkList',
        'cl',
        'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clh.user',
        'u',
        'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'u.branch',
        'b',
        'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'u.manager',
        'm',
        'm.deletedAt IS NOT NULL OR m.deletedAt IS NULL',
      )
      .where('clh.deletedAt IS NULL')
      .andWhere('b.uuid = :uuid_branch', { uuid_branch })
      .andWhere('clh.date = :today', {
        today: format(mexicoCityTime, 'yyyy-MM-dd'),
      })
      .getMany();
  }

  async getCheckListHistoryToNotify() {
    const now = new Date();
    const mexicoCityTime = toZonedTime(now, 'America/Mexico_City');
    const todayFormatted = format(mexicoCityTime, 'yyyy-MM-dd');
    const endHourFrom = format(subMinutes(mexicoCityTime, 60), 'HH:mm');
    const endHourTo = format(mexicoCityTime, 'HH:mm');

    this.logger.log(`now (UTC): ${now.toISOString()}`);
    this.logger.log(`mexicoCityTime: ${mexicoCityTime.toISOString()}`);
    this.logger.log(`today (date filter): ${todayFormatted}`);
    this.logger.log(`endHour range: ${endHourFrom} - ${endHourTo}`);

    const results = await this.chekListHistoryRepository
      .createQueryBuilder('clh')
      .leftJoinAndSelect(
        'clh.check_list_user',
        'clu',
        'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clu.checkList',
        'cl',
        'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clh.user',
        'u',
        'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'u.branch',
        'b',
        'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL',
      )
      .where('clh.deletedAt IS NULL')
      .andWhere('clh.status = :status', { status: 0 })
      .andWhere('clh.date = :today', { today: todayFormatted })
      .andWhere('clu.endHour >= :endHourFrom', { endHourFrom })
      .andWhere('clu.endHour <= :endHourTo', { endHourTo })
      .getMany();

    this.logger.log(`Registros encontrados para notificar: ${results.length}`);
    return results;
  }

  getCheckListHistoryByBranchPaginated(
    uuid_branch: string,
    size: number,
    offset: number,
    name: string,
    lastName: string,
    secondLastName: string,
    checkList: string,
    branch: string,
  ) {
    const now = new Date();
    const mexicoCityTime = toZonedTime(now, 'America/Mexico_City');

    const queryBuilder = this.chekListHistoryRepository
      .createQueryBuilder('clh')
      .leftJoinAndSelect(
        'clh.check_list_user',
        'clu',
        'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clu.checkList',
        'cl',
        'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clh.user',
        'u',
        'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'u.branch',
        'b',
        'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'u.manager',
        'm',
        'm.deletedAt IS NOT NULL OR m.deletedAt IS NULL',
      )
      .where('clh.deletedAt IS NULL')
      .andWhere('clh.date = :today', {
        today: format(mexicoCityTime, 'yyyy-MM-dd'),
      })
      .andWhere('b.uuid = :uuid_branch', { uuid_branch });

    if (name) {
      queryBuilder.andWhere(`LOWER(u.name) LIKE LOWER(:name)`, {
        name: `%${name}%`,
      });
    }
    if (lastName) {
      queryBuilder.andWhere(`LOWER(u.last_name) LIKE LOWER(:lastName)`, {
        lastName: `%${lastName}%`,
      });
    }
    if (secondLastName) {
      queryBuilder.andWhere(
        `LOWER(u.second_last_name) LIKE LOWER(:secondLastName)`,
        { secondLastName: `%${secondLastName}%` },
      );
    }
    if (checkList) {
      queryBuilder.andWhere(`LOWER(cl.name) LIKE LOWER(:checkList)`, {
        checkList: `%${checkList}%`,
      });
    }
    if (branch) {
      queryBuilder.andWhere(`LOWER(b.name) LIKE LOWER(:branch)`, {
        branch: `%${branch}%`,
      });
    }

    queryBuilder.take(size).skip(offset);

    return queryBuilder.getManyAndCount();
  }

  getCheckListHistoryByUuidWithRelations(uuid: string) {
    // return this.chekListHistoryRepository.find({ where: { uuid_user: uuid }, relations: ["check_list_user", 'check_list_user.checkList'], withDeleted: true });

    return this.chekListHistoryRepository
      .createQueryBuilder('clh')
      .leftJoinAndSelect(
        'clh.check_list_user',
        'clu',
        'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clu.checkList',
        'cl',
        'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL',
      )
      .where('clh.uuid = :uuid', { uuid })
      .andWhere('clh.deletedAt IS NULL')
      .getOne();
  }

  getCheckListHistoyByCheckListAndManager(
    uuidCheckList: string,
    uuidBranch: string,
  ) {
    return this.chekListHistoryRepository
      .createQueryBuilder('clh')
      .leftJoinAndSelect(
        'clh.check_list_user',
        'clu',
        'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clu.checkList',
        'cl',
        'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clu.user',
        'u',
        'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'u.manager',
        'm',
        'm.deletedAt IS NOT NULL OR u.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'u.branch',
        'b',
        'b.deletedAt IS NOT NULL OR u.deletedAt IS NULL',
      )
      .where('clh.uuid_check_list = :uuid', { uuid: uuidCheckList })
      .andWhere('clh.deletedAt IS NULL')
      .andWhere('u.uuid_branch = :uuidBranch', { uuidBranch })
      .andWhere('clh.date = :today', {
        today: startOfDay(subHours(new Date(), 6)),
      })
      .getOne();
  }

  async getChecklistComplianceSummary(
    dateInit: string,
    dateEnd: string,
    uuidBranch: string | null,
    uuidChecklist: string | null,
  ) {
    /**
     * checklist realizados correctamente =

        realizado = 1

        encargado_rechaza = 0

        gerente_rechaza = 0
    */
    //Cumplimiento = (Checks realizados correctamente / Total de checks programados) *100

    const totalChacklistCompleted = await this.getTotalChecklistCompleted(
      dateInit,
      dateEnd,
      uuidBranch,
      uuidChecklist,
    );

    const totalChecklist = await this.getTotalChecklists(
      dateInit,
      dateEnd,
      uuidBranch,
      uuidChecklist,
    );

    return (totalChacklistCompleted / totalChecklist) * 100;
  }

  getTotalChecklists(dateInit, dateEnd, uuidBranch, uuidCheckList) {
    const queryBuilder = this.chekListHistoryRepository
      .createQueryBuilder('clh')
      .where('clh.deletedAt IS NULL')
      .andWhere('clh.date BETWEEN :dateInit AND :dateEnd', {
        dateInit: dateInit,
        dateEnd: dateEnd,
      });
    if (uuidBranch) {
      queryBuilder
        .leftJoinAndSelect(
          'clh.user',
          'u',
          'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL',
        )
        .leftJoinAndSelect(
          'u.branch',
          'b',
          'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL',
        );
      queryBuilder.andWhere(`LOWER(b.uuid) =:uuidBranch`, {
        uuidBranch: uuidBranch,
      });
    }

    if (uuidCheckList) {
      queryBuilder.andWhere(`clh.uuid_check_list =:uuidCheckList`, {
        uuidCheckList,
      });
    }

    return queryBuilder.getCount();
  }

  getTodayChecklistsHistoryPendingAndRejected(
    dateInit,
    dateEnd,
    uuidBranch,
    uuidCheckList,
  ) {
    const queryBuilder = this.chekListHistoryRepository
      .createQueryBuilder('clh')
      .where('clh.status = :status', { status: 0 })
      .andWhere('clh.approved = :approved', { approved: 0 })
      .andWhere('clh.managerApproved = :managerApproved', {
        managerApproved: 0,
      })
      .andWhere('clh.deletedAt IS NULL')
      .andWhere('clh.date BETWEEN :todayInit AND :todayEnd', {
        todayInit: dateInit,
        todayEnd: dateEnd,
      });

    queryBuilder
      .leftJoinAndSelect(
        'clh.user',
        'u',
        'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clh.check_list_user',
        'clu',
        'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'clu.checkList',
        'cl',
        'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'u.branch',
        'b',
        'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL',
      );

    if (uuidBranch) {
      queryBuilder.andWhere(`b.uuid = :uuidBranch`, {
        uuidBranch: uuidBranch,
      });
    }

    if (uuidCheckList) {
      queryBuilder.andWhere(`clh.uuid_check_list =:uuidCheckList`, {
        uuidCheckList,
      });
    }

    return queryBuilder.getMany();
  }

  getTtotalChecklistsNotAnsweredAndRejected(
    dateInit,
    dateEnd,
    uuidBranch,
    uuidCheckList,
  ) {
    const queryBuilder = this.chekListHistoryRepository
      .createQueryBuilder('clh')
      .where('clh.status = :status', { status: 0 })
      .andWhere('clh.approved = :approved', { approved: 0 })
      .andWhere('clh.managerApproved = :managerApproved', {
        managerApproved: 0,
      })
      .andWhere('clh.deletedAt IS NULL')
      .andWhere('clh.date BETWEEN :dateInit AND :dateEnd', {
        dateInit: dateInit,
        dateEnd: dateEnd,
      });

    if (uuidBranch) {
      queryBuilder
        .leftJoinAndSelect(
          'clh.user',
          'u',
          'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL',
        )
        .leftJoinAndSelect(
          'u.branch',
          'b',
          'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL',
        );
      queryBuilder.andWhere(`b.uuid = :uuidBranch`, {
        uuidBranch: uuidBranch,
      });
    }

    if (uuidCheckList) {
      queryBuilder.andWhere(`clh.uuid_check_list =:uuidCheckList`, {
        uuidCheckList,
      });
    }

    return queryBuilder.getCount();
  }

  getTotalChecklistCompleted(dateInit, dateEnd, uuidBranch, uuidCheckList) {
    const queryBuilder = this.chekListHistoryRepository
      .createQueryBuilder('clh')
      .where('clh.status = :status', { status: 1 })
      .andWhere('clh.deletedAt IS NULL')
      .andWhere('clh.date BETWEEN :dateInit AND :dateEnd', {
        dateInit: dateInit,
        dateEnd: dateEnd,
      });

    if (uuidBranch) {
      queryBuilder
        .leftJoinAndSelect(
          'clh.user',
          'u',
          'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL',
        )
        .leftJoinAndSelect(
          'u.branch',
          'b',
          'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL',
        );
      queryBuilder.andWhere(`LOWER(b.uuid) =:uuidBranch`, {
        uuidBranch: uuidBranch,
      });
    }

    if (uuidCheckList) {
      queryBuilder.andWhere(`clh.uuid_check_list =:uuidCheckList`, {
        uuidCheckList,
      });
    }

    return queryBuilder.getCount();
  }

  getComplianceData(dateInit: string, dateEnd: string, uuidBranch?: string) {
    const queryBuilder = this.chekListHistoryRepository
      .createQueryBuilder('clh')
      .select([
        'clh.uuid_check_list',
        'clh.managerApproved',
        'clh.managerRevised',
        'clh.revised',
        'clh.approved',
        'clh.status',
        'u.uuid_branch',
      ])
      .leftJoin('clh.user', 'u')
      .where('clh.deletedAt IS NULL')
      .andWhere('clh.date BETWEEN :dateInit AND :dateEnd', {
        dateInit,
        dateEnd,
      });

    if (uuidBranch) {
      queryBuilder.andWhere('u.uuid_branch = :uuidBranch', { uuidBranch });
    }

    return queryBuilder.getRawMany();
  }

  getBranchComplianceSummary(
    dateInit: string,
    dateEnd: string,
    uuidChecklist?: string,
  ) {
    const queryBuilder = this.chekListHistoryRepository
      .createQueryBuilder('clh')
      .innerJoin('clh.user', 'u')
      .select('u.uuid_branch', 'uuid_branch')
      .addSelect('COUNT(*)', 'total')
      .addSelect(`SUM(CASE WHEN clh.status = 1 THEN 1 ELSE 0 END)`, 'completed')
      .addSelect(
        `SUM(CASE WHEN clh.status = 0 AND clh.approved = 0 AND clh.managerApproved = 0 THEN 1 ELSE 0 END)`,
        'incidents',
      )
      .where('clh.deletedAt IS NULL')
      .andWhere('clh.date BETWEEN :dateInit AND :dateEnd', {
        dateInit,
        dateEnd,
      });

    if (uuidChecklist) {
      queryBuilder.andWhere('clh.uuid_check_list = :uuidChecklist', {
        uuidChecklist,
      });
    }

    queryBuilder.groupBy('u.uuid_branch');

    return queryBuilder.getRawMany();
  }
}
