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
        // return this.chekListUserAnswersRepository.findOne({
        //     where: { uuid_check_list_history: uuid_history, uuid_check_list_item_criteria_answer: uuid_answer },
        //     relations: ['check_list_criteria_answer'],
        //     withDeleted: true
        // });

        return this.chekListUserAnswersRepository
            .createQueryBuilder('clua')
            .leftJoinAndSelect(
                'clua.check_list_criteria_answer',
                'clca',
                'clca.deletedAt IS NOT NULL OR clca.deletedAt IS NULL',
            )
            .where('clua.uuid_check_list_history = :uuid_history', { uuid_history })
            .andWhere('clua.uuid_check_list_item_criteria_answer = :uuid_answer', { uuid_answer })
            .andWhere('clua.deletedAt IS NULL')
            .getOne();
    }

    getCheckListUserAnswerByHistory(uuid_history: string) {
        // return this.chekListUserAnswersRepository.find({
        //     where: { uuid_check_list_history: uuid_history },
        //     relations: ['check_list_criteria_answer', 'check_list_criteria_answer.checkListItemCriteria', 'check_list_criteria_answer.checkListItemCriteria.checkListItem', 'check_list_criteria_answer.checkListItemCriteria.checkListItem.check_list'],
        //     withDeleted: true
        // });

        return this.chekListUserAnswersRepository
            .createQueryBuilder('clua')
            .leftJoinAndSelect(
                'clua.check_list_criteria_answer',
                'clca.deletedAt IS NOT NULL OR clca.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'clca.checkListItemCriteria',
                'clic',
                'clic.deletedAt IS NOT NULL OR clic.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'clic.checkListItem',
                'cli',
                'cli.deletedAt IS NOT NULL OR cli.deletedAt IS NULL'
            )
            .leftJoinAndSelect(
                'cli.check_list',
                'cl',
                'cl.deletedAt IS NOT NULL OR cl.deletedAt IS NULL'
            )
            .where('clua.uuid_check_list_history = :uuid_history', { uuid_history })
            .andWhere('clua.deletedAt IS NULL')
            .getMany();
    }

}
