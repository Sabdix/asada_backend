import { Injectable } from '@nestjs/common';
import { CheckListUserRepository } from 'src/checkList/infrastructure/repositories/CheckListUser.Repository';
import { AssingCheckListRequestDto } from 'src/user/application/dtos/AssingCheckListRequest.dto';

@Injectable()
export class CheckListUserService {
    constructor(private readonly chekListUserRepository: CheckListUserRepository) { }

    creteCheckList(request: AssingCheckListRequestDto, weekDay: number, uuid_user: string) {
        return this.chekListUserRepository.save(
            this.chekListUserRepository.create({
                uuid_user: uuid_user,
                uuid_check_list: request.uuid_check_list,
                weekDay: weekDay,
                initHour: request.initHour,
                endHour: request.endHour,
                specialEvent: request.specialEvent,
                eventDate: request.eventDate
            })
        )
    }

    getUserCheckList(uuid_user: string) {
        // return this.chekListUserRepository.find({ where: { uuid_user: uuid_user }, relations: ['checkList'], withDeleted: true });
        return this.chekListUserRepository
            .createQueryBuilder('clu')
            .leftJoinAndSelect(
                'clu.checkList',
                'cl',
                'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL'
            )
            .where('clu.uuid_user = :uuid_user', { uuid_user })
            .andWhere('clu.deletedAt IS NULL')
            .getMany();
    }

    getUserCheckListByUuid(uuid: string) {
        return this.chekListUserRepository.findOneBy({ uuid: uuid });
    }

    deleteCheckListUser(uuid: string) {
        return this.chekListUserRepository.softDelete({ uuid: uuid });
    }

    getAllUserCheckList() {
        // return this.chekListUserRepository.find({relations: ['checkList','user'], withDeleted: true });

        return this.chekListUserRepository
            .createQueryBuilder('clu')
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
            .where('clu.deletedAt IS NULL')
            .getMany();
    }

    async getAllUserCheckListGroupedPaginated(size: number, offset: number, name: string, checkList: string, weekday: string) {
        const queryBuilder = this.chekListUserRepository
        .createQueryBuilder('clu')
        .select([
            'cl.uuid as checkListUuid',
            'cl.name as checkListName', 
            'u.uuid as userUuid',
            'u.name as userName',
            'u.last_name as userLastName',
            'u.second_last_name as userSecondLastName',
            'clu.initHour',
            'clu.endHour',
            'GROUP_CONCAT(clu.weekDay ORDER BY clu.weekDay) as weekDays'
        ])
        .innerJoin('clu.checkList', 'cl')
        .innerJoin('clu.user', 'u')
        .where('clu.deletedAt IS NULL')
        .andWhere('cl.deletedAt IS NULL')
        .andWhere('u.deletedAt IS NULL')
        .groupBy('cl.uuid, u.uuid, clu.initHour, clu.endHour')

        if (name) {
            queryBuilder.andWhere(`(LOWER(u.name) LIKE LOWER(:name) OR LOWER(u.last_name) LIKE LOWER(:name) OR LOWER(u.second_last_name) LIKE LOWER(:name))`, { name: `%${name}%` });
        }
        if (checkList) {
            queryBuilder.andWhere(`LOWER(cl.name) LIKE LOWER(:checkList)`, { checkList: `%${checkList}%` });
        }
        if (weekday) {
            queryBuilder.andWhere(`clu.weekDay = :weekday`, { weekday });
        }

        const totalQuery = queryBuilder.clone();
        const totalResult = await totalQuery.getRawMany();
        const total = totalResult.length;
        
        queryBuilder.limit(size).offset(offset);
        const result = await queryBuilder.getRawMany();

        return {
            data: result,
            total: total
        };
    }

    getAllUserCheckListPaginated(size: number, offset: number, name: string, lastName: string, secondLastName: string, checkList: string, weekday: string) {
        const queryBuilder = this.chekListUserRepository
            .createQueryBuilder('clu')
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
            .where('clu.deletedAt IS NULL')

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
        if (weekday) {
            queryBuilder.andWhere(`LOWER(clu.weekday) LIKE LOWER(:weekday)`, { weekday: `%${weekday}%` });
        }

        queryBuilder.take(size).skip(offset);

        return queryBuilder.getManyAndCount();
    }

    getCheckListByWeekDay(weekDay: number, eventDate: Date) {
        return this.chekListUserRepository.find(
            {
                where: [{ weekDay: weekDay, specialEvent: false },
                { eventDate: eventDate, specialEvent: true }]
            });
    }

    getUserCheckListByBranch(uuid_branch: string, size: number, offset: number, name: string, lastName: string, secondLastName: string, checkList: string, weekday: string) {

        // return this.chekListUserRepository
        //     .createQueryBuilder('clu')
        //     .leftJoinAndSelect(
        //         'clu.checkList',
        //         'cl',
        //         'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL'
        //     )
        //     .leftJoinAndSelect(
        //         'clu.user',
        //         'u',
        //         'u.deletedAt IS NOT NULL OR u.deletedAt IS NULL'
        //     )
        //     .where('clu.deletedAt IS NULL')
        //     .andWhere('u.uuid_branch = :uuid_branch', { uuid_branch })
        //     .take(size)
        //     .skip(offset)
        //     .getManyAndCount();

        const queryBuilder = this.chekListUserRepository
            .createQueryBuilder('clu')
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
            .where('clu.deletedAt IS NULL')
            .andWhere('u.uuid_branch = :uuid_branch', { uuid_branch })

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
        if (weekday) {
            queryBuilder.andWhere(`LOWER(clu.weekday) LIKE LOWER(:weekday)`, { weekday: `%${weekday}%` });
        }

        queryBuilder.take(size).skip(offset);

        return queryBuilder.getManyAndCount();
    }
}
