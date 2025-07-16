import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { UserService } from '../../services/user.service';
import { AssignCheckListCommand } from './AssignCheckList.command';
import { CheckListService } from 'src/checkList/application/services/checkList.service';
import { CheckListUserDto } from 'src/checkList/application/dtos/CheckListUser.dto';
import { CheckListUserService } from 'src/checkList/application/services/checkListUser.service';
import { CheckListUser } from 'src/checkList/domain/entities/CheckListUser.entity';
import { plainToInstance } from 'class-transformer';
import { SimpleUserDto } from 'src/checkList/application/dtos/SimpleUser.dto';
import { CheckListDto } from 'src/checkList/application/dtos/CheckList.dto';
import { startOfDay } from 'date-fns';

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
        
        const checkListArray = new Array<CheckListUserDto>

        command.body.eventDate = startOfDay(command.body.eventDate)

        for (const weekDay of command.body.weekDay){
            const checkListUser = await this.checkListUserService.creteCheckList(command.body, weekDay, command.uuid)
            
            const newcheckListUser = new (CheckListUserDto)
            
            newcheckListUser.user = new SimpleUserDto()
            newcheckListUser.user.uuid = user.uuid
            newcheckListUser.user.name = user.name
            newcheckListUser.user.last_name = user.last_name
            newcheckListUser.user.second_last_name = user.second_last_name

            newcheckListUser.checkList = new CheckListDto()
            newcheckListUser.checkList.uuid = checkList.uuid
            newcheckListUser.checkList.name = checkList.name

            newcheckListUser.endHour = checkListUser.endHour
            newcheckListUser.initHour = checkListUser.initHour
            newcheckListUser.uuid = checkListUser.uuid
            newcheckListUser.weekDay = checkListUser.weekDay
            newcheckListUser.specialEvent = checkListUser.specialEvent
            newcheckListUser.eventDate = checkListUser.eventDate
            

            checkListArray.push(newcheckListUser)
        }

        return WsResponse.buildOkResponse(
            plainToInstance(CheckListUserDto, checkListArray, { excludeExtraneousValues: true }));
        
    }
}
