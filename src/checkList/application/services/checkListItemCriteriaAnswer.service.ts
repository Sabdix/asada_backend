import { Injectable } from '@nestjs/common';
import { CreateCheckListItemRequestDto } from '../dtos/CreateCheckListItemRequest.dto';
import { CheckListItemCriteria } from 'src/checkList/domain/entities/CheckListItemCriteria.entity';
import { CheckListItemCriteriaAnswerRepository } from 'src/checkList/infrastructure/repositories/CheckListItemCriteriaAnswer.Repository';
import { CheckListItemCriteriaAnswers } from 'src/checkList/domain/entities/CheckListItemCriteriaAnswers.entity';
import { CreateCheckListItemCriteriaAnswerCommand } from '../commands/CreateCheckListItemCriteriaAnswer/CreateCheckListItemCriteriaAnswer.command';
import { CreateCheckListItemCriteriaAnswerRequestDto } from '../dtos/CreateCheckListItemCriteriaAnswerRequestDto';

@Injectable()
export class CheckListItemCriteriaAnswerService {
    constructor(private readonly chekListItemCriteriaAnswerRepository: CheckListItemCriteriaAnswerRepository) { }

    creteCheckListItemCriteriaAnswer(request: CreateCheckListItemCriteriaAnswerRequestDto) {
        return this.chekListItemCriteriaAnswerRepository.save(
            this.chekListItemCriteriaAnswerRepository.create({
                text: request.text,
                uuid_check_list_item_criteria: request.uuid_check_list_item_criteria,
                requieres_action: request.requieres_action
            })
        );
    }

    getCheckListItemCriteriaAnswerByTextAndCriteria(text: string, uuid_check_list_item_criteria: string) {
        return this.chekListItemCriteriaAnswerRepository.findOne({ where: { text: text, uuid_check_list_item_criteria: uuid_check_list_item_criteria } });
    }

    getCheckListItemCriteriaAnswerByUuid(uuid: string) {
        return this.chekListItemCriteriaAnswerRepository.findOneBy({ uuid: uuid });
    }

    getCriteriaAnswerByCriteria(uuid: string) {
        return this.chekListItemCriteriaAnswerRepository.find({ where: { uuid_check_list_item_criteria: uuid }, order:{text: 'ASC'}});
    }

    // getCheckList() {
    //     return this.chekListItemRepository.find();
    // }

    deleteCheckListItemCriteriaAnswer(uuid: string) {
        return this.chekListItemCriteriaAnswerRepository.softDelete({ uuid: uuid });
    }

    updateCheckListItemCriteriaAnswer(checkListItemCriteriaAnswer: CheckListItemCriteriaAnswers) {
        return this.chekListItemCriteriaAnswerRepository.save(checkListItemCriteriaAnswer);
    }

}
