import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListUserService } from '../../services/checkListUser.service';
import { CheckListUserDto } from '../../dtos/CheckListUser.dto';
import { plainToInstance } from 'class-transformer';
import { GetAssignedCheckListQuery } from './getAssignedCheckList.query';

@QueryHandler(GetAssignedCheckListQuery)
export class GetAssignedCheckListQueryHandler implements IQueryHandler<GetAssignedCheckListQuery> {
    constructor(
        private checkListUserService: CheckListUserService
    ) { }

    async execute() {
        const checkListUser = await this.checkListUserService.getAllUserCheckList();

       
        return WsResponse.buildOkResponse(
            plainToInstance(CheckListUserDto, checkListUser, { excludeExtraneousValues: true }),
        );
    }
}
