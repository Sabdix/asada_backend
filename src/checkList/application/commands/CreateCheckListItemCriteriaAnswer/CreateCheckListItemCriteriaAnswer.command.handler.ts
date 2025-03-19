import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CheckListItemCriteriaService } from '../../services/checkListItemCriteria.service';
import { CheckListItemCriteriaDto } from '../../dtos/CheckListItemCriteria.dto';
import { CreateCheckListItemCriteriaAnswerCommand } from './CreateCheckListItemCriteriaAnswer.command';
import { CheckListItemCriteriaAnswerService } from '../../services/checkListItemCriteriaAnswer.service';
import { CheckListItemCriteriaAnswerDto } from '../../dtos/CheckListItemCriteriaAnswer.dto';

@CommandHandler(CreateCheckListItemCriteriaAnswerCommand)
export class CreateCheckListItemCriteriaAnswerCommandHandler implements ICommandHandler<CreateCheckListItemCriteriaAnswerCommand> {
  constructor(
    private checkListItemCriteriaAnswerService: CheckListItemCriteriaAnswerService,
    private checkListItemCriteriaService: CheckListItemCriteriaService
  ) { }

  async execute(command: CreateCheckListItemCriteriaAnswerCommand): Promise<WsResponse<CheckListItemCriteriaAnswerDto | string>> {

    if (await this.checkListItemCriteriaAnswerService.getCheckListItemCriteriaAnswerByTextAndCriteria(command.body.text, command.body.uuid_check_list_item_criteria))
      return WsResponse.buildConflictResponse('YA EXISTE UNA RESPUESTA CON ESE NOMBRE','CHECKLIST_ITEM_CRITERIA_ANSWER ALREADY EXISTS');

    if (! await this.checkListItemCriteriaService.getCheckListItemCriteriaByUuid(command.body.uuid_check_list_item_criteria))
      return WsResponse.buildNotFoundResponse('CHECKLIST_ITEM_CRITERIA NOT FOUND');

    const checkListItemCriteriaAnswer = await this.checkListItemCriteriaAnswerService.creteCheckListItemCriteriaAnswer(command.body)

    return WsResponse.buildOkResponse(
      plainToInstance(CheckListItemCriteriaAnswerDto, checkListItemCriteriaAnswer, { excludeExtraneousValues: true }),
    );
  }
}
