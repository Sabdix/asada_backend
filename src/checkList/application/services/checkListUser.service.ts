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

     getAllUserCheckListPaginated(size:number, offset:number) {
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
            .take(size)
            .skip(offset)
            .getManyAndCount();
    }

    getCheckListByWeekDay(weekDay: number, eventDate: Date) {
        return this.chekListUserRepository.find(
            {
                where: [{ weekDay: weekDay, specialEvent: false },
                { eventDate: eventDate, specialEvent: true }] 
            });
    }

    getUserCheckListByBranch(uuid_branch: string) {

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
            .andWhere('u.uuid_branch = :uuid_branch', { uuid_branch })
            .getMany();
    }
}
