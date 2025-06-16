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
                endHour: request.endHour
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

    getCheckListByWeekDay(weekDay: number) {
        return this.chekListUserRepository.find({ where: { weekDay: weekDay } });
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
