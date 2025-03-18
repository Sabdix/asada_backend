import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { UserService } from '../../services/user.service';
import { AssignCheckListCommand } from './AssignCheckList.command';
import { CheckListService } from 'src/checkList/application/services/checkList.service';
import { CheckListUserDto } from 'src/checkList/application/dtos/CheckListUser.dto';
import { CheckListUserService } from 'src/checkList/application/services/checkListUser.service';
import { CheckListUser } from 'src/checkList/domain/entities/CheckListUser.entity';
import { plainToInstance } from 'class-transformer';

@CommandHandler(AssignCheckListCommand)
export class AssignCheckListCommandHandler implements ICommandHandler<AssignCheckListCommand> {
    constructor(
        private userService: UserService,
        private checkListService: CheckListService,
        private checkListUserService: CheckListUserService
    ) { }

    async execute(command: AssignCheckListCommand): Promise<WsResponse<CheckListUserDto[] | string>> {

        const user = await this.userService.getUserByUuid(command.uuid);
        if (!user)
            return WsResponse.buildNotFoundResponse('USER NOT FOUND');
        
        const checkList = await this.checkListService.getCheckListByUuid(command.body.uuid_check_list);
        if (!checkList)
            return WsResponse.buildNotFoundResponse('CHECKLIST NOT FOUND');
        
        const checkListArray = new Array<CheckListUser>

        for (const weekDay of command.body.weekDay){
            const checkListUser = await this.checkListUserService.creteCheckList(command.body, weekDay, command.uuid)

            checkListArray.push(checkListUser)
        }

        return WsResponse.buildOkResponse(
            plainToInstance(CheckListUserDto, checkListArray, { excludeExtraneousValues: true }));
        
    }
}
