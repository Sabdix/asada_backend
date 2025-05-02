import { Injectable } from '@nestjs/common';
import { CreateCheckListRequestDto } from '../dtos/CreateCheckList.dto';
import { CheckListHistoryRepository } from 'src/checkList/infrastructure/repositories/CheckListHistory.Repository';
import { CreateCheckListHistoryRequestDto } from '../dtos/CreateCheckListHistoryRequest.dto';
import { CheckListUser } from 'src/checkList/domain/entities/CheckListUser.entity';
import { CheckListHistory } from 'src/checkList/domain/entities/CheckListHistory';

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
        return this.chekListHistoryRepository.find({ relations: ["check_list_user", 'check_list_user.checkList','user','user.branch'] });
    }

    getCheckListHistoryByUser(uuid: string) {
        return this.chekListHistoryRepository.find({ where: { uuid_user: uuid }, relations: ["check_list_user", 'check_list_user.checkList'] });
    }

    getCheckListHistoryByUuid(uuid: string) {
        return this.chekListHistoryRepository.findOne({ where: { uuid: uuid } });
    }

    UpdateCheckListHistoryByUuid(history: CheckListHistory) {
        return this.chekListHistoryRepository.save(history);
    }
}
