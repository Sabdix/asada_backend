import { Injectable } from '@nestjs/common';
import { CreateCheckListItemRequestDto } from '../dtos/CreateCheckListItemRequest.dto';
import { CheckListItemRepository } from 'src/checkList/infrastructure/repositories/CheckListItem.Repository';
import { CheckListItem } from 'src/checkList/domain/entities/CheckListItem.entity';

@Injectable()
export class CheckListItemService {
    constructor(private readonly chekListItemRepository: CheckListItemRepository) { }

    creteCheckListItem(request: CreateCheckListItemRequestDto) {
        return this.chekListItemRepository.save(
            this.chekListItemRepository.create({
                name: request.name,
                uuid_check_list: request.uuid_check_list
            })
        )
    }

    getCheckListItemByNameAndCheckList(name: string, uuid_check_list: string) {
        return this.chekListItemRepository.findOne({ where: { name: name, uuid_check_list: uuid_check_list } });
    }

    getCheckListItemByUuid(uuid: string) {
        return this.chekListItemRepository.findOneBy({ uuid: uuid });
    }

    getCheckListItemByCheckList(uuid_check_list: string) {
        return this.chekListItemRepository.find({ where: { uuid_check_list: uuid_check_list }, order:{name: 'ASC'} });
    }
    // getCheckList() {
    //     return this.chekListItemRepository.find();
    // }

    deleteCheckListItem(uuid: string) {
        return this.chekListItemRepository.softDelete({ uuid: uuid });
    }

    updateCheckListItem(checkListItem: CheckListItem) {
        return this.chekListItemRepository.save(checkListItem);
    }

}
