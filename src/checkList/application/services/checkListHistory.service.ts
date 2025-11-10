import { Injectable } from '@nestjs/common';
import { CheckListHistoryRepository } from 'src/checkList/infrastructure/repositories/CheckListHistory.Repository';
import { CreateCheckListHistoryRequestDto } from '../dtos/CreateCheckListHistoryRequest.dto';
import { CheckListUser } from 'src/checkList/domain/entities/CheckListUser.entity';
import { CheckListHistory } from 'src/checkList/domain/entities/CheckListHistory';
import { format, startOfDay, subMinutes } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { User } from 'src/user/domain/entities/User.entity';

@Injectable()
export class CheckListHistoryService {
    constructor(private readonly chekListHistoryRepository: CheckListHistoryRepository) { }

    creteCheckListHistory(request: CreateCheckListHistoryRequestDto, checkListUser: CheckListUser) {
        return this.chekListHistoryRepository.save(
            this.chekListHistoryRepository.create({
                status: request.status,
                date: request.date,
                uuid_check_list: request.uuid_check_list,
                uuid_user: request.uuid_user,
                check_list_user: checkListUser
            })
        )
    }

    getCheckListHistoyByUuidAndUser(uuid: string, uuid_user) {
        return this.chekListHistoryRepository.findOne({ where: { uuid: uuid, uuid_user: uuid_user } });
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
                'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'clu.checkList',
                'cl',
                'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'clh.user',
                'u',
                'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'u.branch',
                'b', // Alias para Branch
                'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'u.manager',
                'm', // Alias para Manager
                'm.deletedAt IS NOT NULL OR m.deletedAt IS NULL'
            )
            .where('clh.deletedAt IS NULL')
            .andWhere('clh.date = :today', { today: format(mexicoCityTime, 'yyyy-MM-dd') })
            .getMany();
    }

    getAllCheckListHistoryPaginated(size: number, offset: number, name: string, lastName: string, secondLastName: string, checkList: string, branch: string) {
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
                'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'clu.checkList',
                'cl',
                'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'clh.user',
                'u',
                'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'u.branch',
                'b', // Alias para Branch
                'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'u.manager',
                'm', // Alias para Manager
                'm.deletedAt IS NOT NULL OR m.deletedAt IS NULL'
            )
            .where('clh.deletedAt IS NULL')
            .andWhere('clh.date = :today', { today: format(mexicoCityTime, 'yyyy-MM-dd') })

        if (name) {
            queryBuilder.andWhere(`LOWER(u.name) LIKE LOWER(:name)`, { name: `%${name}%` });
        }
        if (lastName) {
            queryBuilder.andWhere(`LOWER(u.last_name) LIKE LOWER(:lastName)`, { lastName: `%${lastName}%` });
        }
        if (secondLastName) {
            queryBuilder.andWhere(`LOWER(u.second_last_name) LIKE LOWER(:secondLastName)`, { secondLastName: `%${secondLastName}%` });
        }
        if (checkList) {
            queryBuilder.andWhere(`LOWER(cl.name) LIKE LOWER(:checkList)`, { checkList: `%${checkList}%` });
        }
        if (branch) {
            queryBuilder.andWhere(`LOWER(b.name) LIKE LOWER(:branch)`, { branch: `%${branch}%` });
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
                'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'clu.checkList',
                'cl',
                'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL'
            )
            .where('clh.uuid_user = :uuid_user', { uuid_user })
            .andWhere('clh.date = :today', { today: startOfDay(mexicoCityTime) })
            .andWhere('clh.deletedAt IS NULL')
            .getMany();
    }

    getCheckListHistoryByUuid(uuid: string) {
        return this.chekListHistoryRepository.findOne({ where: { uuid: uuid } });
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
                'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'clu.checkList',
                'cl',
                'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'clh.user',
                'u',
                'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'u.branch',
                'b',
                'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL'
            )
            .where('clh.date BETWEEN :initialDate AND :endDate', { initialDate, endDate })
            .andWhere('clh.deletedAt IS NULL')
            .getMany();
    }

    getBranchCheckListHistoryByRangeTime(initialDate: Date, endDate: Date, uuid_branch: string) {
        // return this.chekListHistoryRepository.find({
        //     where: { date: Between(initialDate, endDate) },
        //     relations: ["check_list_user", 'check_list_user.checkList', 'user', 'user.branch'], withDeleted: true
        // });

        return this.chekListHistoryRepository
            .createQueryBuilder('clh')
            .leftJoinAndSelect(
                'clh.check_list_user',
                'clu',
                'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'clu.checkList',
                'cl',
                'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'clh.user',
                'u',
                'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'u.branch',
                'b',
                'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL'
            )
            .where('clh.date BETWEEN :initialDate AND :endDate', { initialDate, endDate })
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
                'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'clu.checkList',
                'cl',
                'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'clh.user',
                'u',
                'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'u.branch',
                'b',
                'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'u.manager',
                'm',
                'm.deletedAt IS NOT NULL OR m.deletedAt IS NULL'
            )
            .where('clh.deletedAt IS NULL')
            .andWhere('b.uuid = :uuid_branch', { uuid_branch })
            .andWhere('clh.date = :today', { today: format(mexicoCityTime, 'yyyy-MM-dd') })
            .getMany();
    }

    getCheckListHistoryToNotify() {
        // return this.chekListHistoryRepository.find({ relations: ["check_list_user", 'check_list_user.checkList', 'user', 'user.branch'], withDeleted: true });
        const now = new Date();
        const mexicoCityTime = toZonedTime(now, 'America/Mexico_City');
        return this.chekListHistoryRepository
            .createQueryBuilder('clh')
            .leftJoinAndSelect(
                'clh.check_list_user',
                'clu',
                'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'clu.checkList',
                'cl',
                'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'clh.user',
                'u',
                'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'u.branch',
                'b',
                'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL'
            )
            .where('clh.deletedAt IS NULL')
            .andWhere('clh.status = :status', { status: 0 })
            .andWhere('clh.date = :today', { today: format(mexicoCityTime, 'yyyy-MM-dd') })
            .andWhere('clu.endHour =:endHour', { endHour: format(subMinutes(new Date(), 30), 'HH:mm') })
            .getMany();
    }

    getCheckListHistoryByBranchPaginated(uuid_branch: string, size: number, offset: number, name: string, lastName: string, secondLastName: string, checkList: string, branch: string) {
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
        //         'b',
        //         'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL'
        //     )
        //     .leftJoinAndSelect(
        //         'u.manager',
        //         'm',
        //         'm.deletedAt IS NOT NULL OR m.deletedAt IS NULL'
        //     )
        //     .where('clh.deletedAt IS NULL')
        //     .andWhere('b.uuid = :uuid_branch', { uuid_branch })
        //     .take(size)
        //     .skip(offset)
        //     .getManyAndCount();
        const now = new Date();
        const mexicoCityTime = toZonedTime(now, 'America/Mexico_City');

        const queryBuilder = this.chekListHistoryRepository
            .createQueryBuilder('clh')
            .leftJoinAndSelect(
                'clh.check_list_user',
                'clu',
                'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'clu.checkList',
                'cl',
                'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'clh.user',
                'u',
                'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'u.branch',
                'b',
                'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'u.manager',
                'm',
                'm.deletedAt IS NOT NULL OR m.deletedAt IS NULL'
            )
            .where('clh.deletedAt IS NULL')
            .andWhere('clh.date = :today', { today: format(mexicoCityTime, 'yyyy-MM-dd') })
            .andWhere('b.uuid = :uuid_branch', { uuid_branch })

        if (name) {
            queryBuilder.andWhere(`LOWER(u.name) LIKE LOWER(:name)`, { name: `%${name}%` });
        }
        if (lastName) {
            queryBuilder.andWhere(`LOWER(u.last_name) LIKE LOWER(:lastName)`, { lastName: `%${lastName}%` });
        }
        if (secondLastName) {
            queryBuilder.andWhere(`LOWER(u.second_last_name) LIKE LOWER(:secondLastName)`, { secondLastName: `%${secondLastName}%` });
        }
        if (checkList) {
            queryBuilder.andWhere(`LOWER(cl.name) LIKE LOWER(:checkList)`, { checkList: `%${checkList}%` });
        }
        if (branch) {
            queryBuilder.andWhere(`LOWER(b.name) LIKE LOWER(:branch)`, { branch: `%${branch}%` });
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
                'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'clu.checkList',
                'cl',
                'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL'
            )
            .where('clh.uuid = :uuid', { uuid })
            .andWhere('clh.deletedAt IS NULL')
            .getOne();
    }

    getCheckListHistoyByCheckListAndManager(uuidCheckList: string, uuidBranch: string) {
        return this.chekListHistoryRepository
            .createQueryBuilder('clh')
            .leftJoinAndSelect(
                'clh.check_list_user',
                'clu',
                'clu.deletedAt IS NOT NULL OR clu.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'clu.checkList',
                'cl',
                'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'clu.user',
                'u',
                'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL'
            )
            .where('clh.uuid_check_list = :uuid', { uuid: uuidCheckList })
            .andWhere('clh.deletedAt IS NULL')
            .andWhere('u.uuid_branch = :uuidBranch',{uuidBranch})
            .andWhere('clh.date = :today',{today: startOfDay(new Date)})
            .getOne();
    }
}
