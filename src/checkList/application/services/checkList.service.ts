import { Injectable } from '@nestjs/common';
import { Role } from 'src/user/domain/entities/Role.entity';
import { CheckListRepository } from 'src/checkList/infrastructure/repositories/CheckList.Repository';
import { CreateCheckListRequestDto } from '../dtos/CreateCheckList.dto';
import { CheckList } from 'src/checkList/domain/entities/CheckList.entity';

@Injectable()
export class CheckListService {
    constructor(private readonly chekListRepository: CheckListRepository) { }

    creteCheckList(request: CreateCheckListRequestDto) {
        return this.chekListRepository.save(
            this.chekListRepository.create({
                name: request.name
            })
        )
    }

    getCheckListByName(name: string) {
        return this.chekListRepository.findOneBy({ name: name });
    }

    getCheckListByUuid(uuid: string) {
        return this.chekListRepository.findOneBy({ uuid: uuid });
    }
    

    getCheckList() {
        return this.chekListRepository.find();
    }

    deleteCheckList(uuid: string) {
        return this.chekListRepository.softDelete({uuid: uuid});
    }

    updateCheckList(checkList: CheckList) {
        return this.chekListRepository.save(checkList);
    }

}
