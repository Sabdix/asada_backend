import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CheckListHistoryService } from '../../services/checkListHistory.service';
import { getCheckListHistoryAnswersByHistoryQuery } from './getCheckListHistoryAnswersByHistory.query';
import { CheckListUserAnswersDto } from '../../dtos/CheckListUserAnswers.dto';
import { CheckListUserAnswersService } from '../../services/checkListUserAnswers.service';

@QueryHandler(getCheckListHistoryAnswersByHistoryQuery)
export class getCheckListHistoryAnswersByHistoryQueryHandler implements IQueryHandler<getCheckListHistoryAnswersByHistoryQuery> {
    constructor(
        private checkListUserAnswersService: CheckListUserAnswersService,
        private CheckListHistoryService: CheckListHistoryService
    ) { }

    async execute(query: getCheckListHistoryAnswersByHistoryQuery) {
        
        const chekListUserHistory = await this.CheckListHistoryService.getCheckListHistoyByUuid(query.uuid)
        if (!chekListUserHistory)
            return WsResponse.buildNotFoundResponse('CHECKLIST_HISTORY NOT EXISTS');

        const checkListHistory = await this.checkListUserAnswersService.getCheckListUserAnswerByHistory(query.uuid);
       
        return WsResponse.buildOkResponse(
            plainToInstance(CheckListUserAnswersDto, checkListHistory, { excludeExtraneousValues: true }),
        );
    }
}
