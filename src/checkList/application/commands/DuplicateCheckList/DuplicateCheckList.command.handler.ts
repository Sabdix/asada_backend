import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CheckListService } from '../../services/checkList.service';
import { CheckListItemDto } from '../../dtos/CheckListItem.dto';
import { CheckListItemService } from '../../services/checkListItem.service';
import { CreateCheckListItemRequestDto } from '../../dtos/CreateCheckListItemRequest.dto';
import { CheckListItemCriteriaService } from '../../services/checkListItemCriteria.service';
import { CreateCheckListItemCriteriaRequestDto } from '../../dtos/CreateCheckListItemCriteriaRequest.dto';
import { CheckListItemCriteriaAnswerService } from '../../services/checkListItemCriteriaAnswer.service';
import { CreateCheckListItemCriteriaAnswerRequestDto } from '../../dtos/CreateCheckListItemCriteriaAnswerRequestDto';
import { CriteriaByItemDto } from '../../dtos/CriteriaByItem.dto';
import { DuplicateCheckListCommand } from './DuplicateCheckList.command';
import { CheckListDto } from '../../dtos/CheckList.dto';
import { CreateCheckListRequestDto } from '../../dtos/CreateCheckList.dto';
import { ItemDto } from '../../dtos/Item.dto';

@CommandHandler(DuplicateCheckListCommand)
export class DuplicateCheckListCommandHandler implements ICommandHandler<DuplicateCheckListCommand> {
    constructor(
        private checkListService: CheckListService,
        private checkListItemService: CheckListItemService,
        private checkListItemCriteriaService: CheckListItemCriteriaService,
        private checkListItemCriteriaAnswerService: CheckListItemCriteriaAnswerService
    ) { }

    async execute(command: DuplicateCheckListCommand): Promise<WsResponse<CheckListDto | string>> {

        const checkList = await this.checkListService.getCheckListByUuid(command.body.uuid_check_list)

        if (!checkList)
            return WsResponse.buildNotFoundResponse('CHECKLIST NOT EXISTS');

        if (await this.checkListService.getCheckListByName(command.body.name))
            return WsResponse.buildConflictResponse('YA EXISTE UN CHECKLIST CON ESE NOMBRE', 'CHECKLIST ALREADY EXISTS');

        const newCheckListBody = new CreateCheckListRequestDto
        newCheckListBody.name = command.body.name

        const response = new CheckListDto
        const newCheckList = await this.checkListService.creteCheckList(newCheckListBody)
        response.name = newCheckList.name
        response.uuid = newCheckList.uuid

        const items = await this.checkListItemService.getCheckListItemByCheckList(checkList.uuid)
        response.checkListItem = new Array<CheckListItemDto>

        for (const item of items) {
            const newItemBody = new CreateCheckListItemRequestDto
            newItemBody.name = item.name
            newItemBody.uuid_check_list = newCheckList.uuid

            const newItem = await this.checkListItemService.creteCheckListItem(newItemBody)
            const itemResponse = new ItemDto
            itemResponse.name = newItem.name
            itemResponse.uuid = newItem.uuid
            response.checkListItem.push(itemResponse)

            const criteria = await this.checkListItemCriteriaService.getItemCriteriaByItem(item.uuid)

            for (const criterion of criteria) {
                const newCriterionBody = new CreateCheckListItemCriteriaRequestDto
                newCriterionBody.text = criterion.text
                newCriterionBody.uuid_check_list_item = newItem.uuid

                const newCriterion = await this.checkListItemCriteriaService.creteCheckListItemCriteria(newCriterionBody)
                const criteronResponse = new CriteriaByItemDto
                criteronResponse.text = newCriterion.text
                criteronResponse.uuid = newCriterion.uuid

                const anwers = await this.checkListItemCriteriaAnswerService.getCriteriaAnswerByCriteria(criterion.uuid)

                for (const answer of anwers) {
                    const newAnswerBody = new CreateCheckListItemCriteriaAnswerRequestDto
                    newAnswerBody.text = answer.text
                    newAnswerBody.uuid_check_list_item_criteria = newCriterion.uuid

                    await this.checkListItemCriteriaAnswerService.creteCheckListItemCriteriaAnswer(newAnswerBody)
                }
            }
        }

        return WsResponse.buildOkResponse(
            plainToInstance(CheckListDto, response, { excludeExtraneousValues: true }),
        );
    }
}
