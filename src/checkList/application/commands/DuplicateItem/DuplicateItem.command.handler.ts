import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CheckListService } from '../../services/checkList.service';
import { CheckListItemDto } from '../../dtos/CheckListItem.dto';
import { CheckListItemService } from '../../services/checkListItem.service';
import { DuplicateItemCommand } from './DuplicateItem.command';
import { CreateCheckListItemRequestDto } from '../../dtos/CreateCheckListItemRequest.dto';
import { CheckListItemCriteriaService } from '../../services/checkListItemCriteria.service';
import { CreateCheckListItemCriteriaRequestDto } from '../../dtos/CreateCheckListItemCriteriaRequest.dto';
import { CheckListItemCriteriaAnswerService } from '../../services/checkListItemCriteriaAnswer.service';
import { CreateCheckListItemCriteriaAnswerRequestDto } from '../../dtos/CreateCheckListItemCriteriaAnswerRequestDto';
import { CriteriaByItemDto } from '../../dtos/CriteriaByItem.dto';

@CommandHandler(DuplicateItemCommand)
export class DuplicateItemCommandHandler implements ICommandHandler<DuplicateItemCommand> {
    constructor(
        private checkListItemService: CheckListItemService,
        private checkListItemCriteriaService: CheckListItemCriteriaService,
        private checkListItemCriteriaAnswerService: CheckListItemCriteriaAnswerService
    ) { }

    async execute(command: DuplicateItemCommand): Promise<WsResponse<CheckListItemDto | string>> {

        const item = await this.checkListItemService.getCheckListItemByUuid(command.body.uuid_check_list_item)

        if (!item)
            return WsResponse.buildNotFoundResponse('CHECKLIST_ITEM NOT EXISTS');

        const newItemBody = new CreateCheckListItemRequestDto
        newItemBody.name = command.body.name
        newItemBody.uuid_check_list = item?.uuid_check_list

        const response = new CheckListItemDto
        const newItem = await this.checkListItemService.creteCheckListItem(newItemBody)
        response.name = newItem.name
        response.uuid = newItem.uuid
        
        const criteria = await this.checkListItemCriteriaService.getItemCriteriaByItem(item.uuid)
        response.checkListItemCriteria = new Array<CriteriaByItemDto>
        
        for (const criterion of criteria){
            const newCriterionBody = new CreateCheckListItemCriteriaRequestDto
            newCriterionBody.text = criterion.text
            newCriterionBody.uuid_check_list_item = newItem.uuid
            
            const newCriterion = await this.checkListItemCriteriaService.creteCheckListItemCriteria(newCriterionBody)
            const criteronResponse = new CriteriaByItemDto
            criteronResponse.text = newCriterion.text
            criteronResponse.uuid = newCriterion.uuid
            response.checkListItemCriteria.push(criteronResponse)

            const anwers = await this.checkListItemCriteriaAnswerService.getCriteriaAnswerByCriteria(criterion.uuid)

            for (const answer of anwers){
                const newAnswerBody = new CreateCheckListItemCriteriaAnswerRequestDto
                newAnswerBody.text = answer.text
                newAnswerBody.uuid_check_list_item_criteria = newCriterion.uuid
                
                await this.checkListItemCriteriaAnswerService.creteCheckListItemCriteriaAnswer(newAnswerBody)
            }
        }

        return WsResponse.buildOkResponse(
            plainToInstance(CheckListItemDto, response, { excludeExtraneousValues: true }),
        );
    }
}
