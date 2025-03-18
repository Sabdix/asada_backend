import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { UserDto } from '../../dtos/User.dto';
import { UpdateUserRequestDto } from '../../dtos/UpdateUserRequest.dto';


export class UpdateUserCommand extends Command<WsResponse<UserDto | string>> {
  constructor(public readonly body: UpdateUserRequestDto, public readonly uuid: string
  ) {
    super();
  }
}
