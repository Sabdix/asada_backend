import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetUsersQuery } from './GetUsers.query';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../dtos/User.dto';

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private  userService: UserService) {}

  async execute(query: GetUsersQuery): Promise<WsResponse<UserDto[]>> {
    const [users, total] = await this.userService.getUsersPaginated(query.size, query.offset, query.name, query.lastName, query.secondLastName, query.role, query.branch);

    return WsResponse.buildOkListResponse(
      plainToInstance(UserDto, users, { excludeExtraneousValues: true }), total
    );
  }
}
