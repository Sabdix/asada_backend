import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CreateCheckListCommand } from './CreateCheckList.command';
import { CheckListService } from '../../services/checkList.service';
import { CheckListDto } from '../../dtos/CheckList.dto';

@CommandHandler(CreateCheckListCommand)
export class CreateCheckListCommandHandler implements ICommandHandler<CreateCheckListCommand> {
  constructor(
    private checkListService: CheckListService,
  ) {}

  async execute(command: CreateCheckListCommand): Promise<WsResponse<CheckListDto | string>> {

    if (await this.checkListService.getCheckListByName(command.body.name))
        return WsResponse.buildConflictResponse('YA EXISTE UN CHECKLIST CON ESE NOMBRE','CHECKLIST ALREADY EXISTS');

    const checkList = await this.checkListService.creteCheckList(command.body)

    return WsResponse.buildOkResponse(
      plainToInstance(CheckListDto, checkList, { excludeExtraneousValues: true }),
    );
  }
}
