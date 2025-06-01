import { Injectable } from '@nestjs/common';
import { CreateCheckListRequestDto } from '../dtos/CreateCheckList.dto';
import { CheckListHistoryRepository } from 'src/checkList/infrastructure/repositories/CheckListHistory.Repository';
import { CreateCheckListHistoryRequestDto } from '../dtos/CreateCheckListHistoryRequest.dto';
import { CheckListUser } from 'src/checkList/domain/entities/CheckListUser.entity';
import { CheckListHistory } from 'src/checkList/domain/entities/CheckListHistory';
import { Between } from 'typeorm';

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
            .where('clh.deletedAt IS NULL')
            .getMany();
    }

    getCheckListHistoryByUser(uuid_user: string) {
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
            .where('clh.uuid_user = :uuid_user', { uuid_user })
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
}
