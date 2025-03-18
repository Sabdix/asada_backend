import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { UserDto } from '../../dtos/User.dto';
import { CreateUserRequestDto } from '../../dtos/CreateUserRequest.dto';


export class CreateUserCommand extends Command<WsResponse< UserDto | string>> {
  constructor(public body: CreateUserRequestDto) {
    super();
  }
}
