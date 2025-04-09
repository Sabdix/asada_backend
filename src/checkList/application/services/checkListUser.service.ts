import { Injectable } from '@nestjs/common';
import { CheckListUserRepository } from 'src/checkList/infrastructure/repositories/CheckListUser.Repository';
import { AssingCheckListRequestDto } from 'src/user/application/dtos/AssingCheckListRequest.dto';
import { User } from 'src/user/domain/entities/User.entity';

@Injectable()
export class CheckListUserService {
    constructor(private readonly chekListUserRepository: CheckListUserRepository) { }

    creteCheckList(request: AssingCheckListRequestDto, weekDay: string, uuid_user: string) {
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
        return this.chekListUserRepository.find({ where: { uuid_user: uuid_user }, relations: ['checkList'] });
    }

    getUserCheckListByUuid(uuid: string) {
        return this.chekListUserRepository.findOneBy({ uuid: uuid });
    }

    deleteCheckListUser(uuid: string) {
        return this.chekListUserRepository.softDelete({ uuid: uuid });
    }

    getAllUserCheckList() {
        return this.chekListUserRepository.find({relations: ['checkList','user'] });
    }
}
