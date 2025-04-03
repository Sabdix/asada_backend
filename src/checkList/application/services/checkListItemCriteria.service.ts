import { Injectable } from '@nestjs/common';
import { CheckListItemCriteriaRepository } from 'src/checkList/infrastructure/repositories/CheckListItemCriteria.Repository';
import { CheckListItemCriteria } from 'src/checkList/domain/entities/CheckListItemCriteria.entity';
import { CreateCheckListItemCriteriaRequestDto } from '../dtos/CreateCheckListItemCriteriaRequest.dto';

@Injectable()
export class CheckListItemCriteriaService {
    constructor(private readonly chekListItemCriteriaRepository: CheckListItemCriteriaRepository) { }

    creteCheckListItemCriteria(request: CreateCheckListItemCriteriaRequestDto) {
        return this.chekListItemCriteriaRepository.save(
            this.chekListItemCriteriaRepository.create({
                text: request.text,
                uuid_check_list_item: request.uuid_check_list_item
            })
        );
    }

    getCheckListItemCriteriaByTextAndItem(text: string, uuid_check_list_item: string) {
        return this.chekListItemCriteriaRepository.findOne({ where:{ text: text, uuid_check_list_item: uuid_check_list_item} });
    }

    getCheckListItemCriteriaByUuid(uuid: string) {
        return this.chekListItemCriteriaRepository.findOneBy({ uuid: uuid });
    }

    getItemCriteriaByItem(uuid: string) {
        return this.chekListItemCriteriaRepository.find({ where: { uuid_check_list_item: uuid }, order:{text: 'ASC'} });
    }

    // getCheckList() {
    //     return this.chekListItemRepository.find();
    // }

    deleteCheckListItemCriteria(uuid: string) {
        return this.chekListItemCriteriaRepository.softDelete({ uuid: uuid });
    }

    updateCheckListItemCriteria(CheckListItemCriteria: CheckListItemCriteria) {
        return this.chekListItemCriteriaRepository.save(CheckListItemCriteria);
    }

}
