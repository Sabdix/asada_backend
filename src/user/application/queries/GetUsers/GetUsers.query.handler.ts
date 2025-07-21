import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetUsersQuery } from './GetUsers.query';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../dtos/User.dto';

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private  userService: UserService) {}

  async execute(): Promise<WsResponse<UserDto[]>> {
    const users = await this.userService.getUsers();

    return WsResponse.buildOkResponse(
      plainToInstance(UserDto, users, { excludeExtraneousValues: true }),
    );
  }
}
