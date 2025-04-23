import { Injectable } from '@nestjs/common';
import { CheckListUserAnswersRepository } from 'src/checkList/infrastructure/repositories/CheckListUserAnswers.Repository';
import { CreateCheckListUserAnswerRequest } from '../dtos/CreateCheckListUserAnswerRequest.dto';

@Injectable()
export class CheckListUserAnswersService {
    constructor(private readonly chekListUserAnswersRepository: CheckListUserAnswersRepository) { }

    creteCheckListHistory(request: CreateCheckListUserAnswerRequest) {
        return this.chekListUserAnswersRepository.save(
            this.chekListUserAnswersRepository.create({
                uuid_check_list_history: request.uuid_check_list_history,
                uuid_check_list_item_criteria_answer: request.uuid_check_list_item_criteria_answer,
                comment: request.comment
            })
        )
    }

    getCheckListUserAnswerByHistoryAndAnswer(uuid_history: string, uuid_answer: string) {
        return this.chekListUserAnswersRepository.findOne({ where: { uuid_check_list_history: uuid_history, uuid_check_list_item_criteria_answer: uuid_answer} });
    }

    getCheckListUserAnswerByHistory(uuid_history: string) {
        return this.chekListUserAnswersRepository.find({ where: { uuid_check_list_history: uuid_history} });
    }

}
