import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CheckListItemCriteriaService } from '../../services/checkListItemCriteria.service';
import { CheckListItemCriteriaDto } from '../../dtos/CheckListItemCriteria.dto';
import { GetCriteriaAnswerByCriteriaQuery } from './getCriteriaAnswerByCriteria.query';
import { CheckListItemCriteriaAnswerDto } from '../../dtos/CheckListItemCriteriaAnswer.dto';
import { CheckListItemCriteriaAnswerService } from '../../services/checkListItemCriteriaAnswer.service';

@QueryHandler(GetCriteriaAnswerByCriteriaQuery)
export class GetCriteriaAnswerByCriteriaQueryHandler implements IQueryHandler<GetCriteriaAnswerByCriteriaQuery> {
    constructor(
        private checkListItemCriteriaAnswerService: CheckListItemCriteriaAnswerService,
        private checkListItemCriteriaService: CheckListItemCriteriaService
        
    ) { }

    async execute(query: GetCriteriaAnswerByCriteriaQuery): Promise<WsResponse<CheckListItemCriteriaAnswerDto[] | string>> {
        if (!await this.checkListItemCriteriaService.getCheckListItemCriteriaByUuid(query.uuid))
            return WsResponse.buildNotFoundResponse('CHECKLIST_ITEM_CRITERIA NOT FOUND');

        const criteriaAnswer = await this.checkListItemCriteriaAnswerService.getCriteriaAnswerByCriteria(query.uuid);

        return WsResponse.buildOkResponse(
            plainToInstance(CheckListItemCriteriaAnswerDto, criteriaAnswer, { excludeExtraneousValues: true }),
        );
    }
}
