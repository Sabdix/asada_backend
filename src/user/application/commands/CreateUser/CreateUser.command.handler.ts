import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CreateUserCommand } from './CreateUser.command';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../dtos/User.dto';
import { RoleService } from '../../services/role.service';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private userService: UserService,
    private roleService: RoleService
  ) {}

  async execute(command: CreateUserCommand): Promise<WsResponse<UserDto | string>> {

    if (await this.userService.getUserByMail(command.body.mail))
        return WsResponse.buildConflictResponse('YA EXISTE UN USUARIO CON ESE CORREO ELECTRONICO','USER ALREADY EXISTS');

    if(! await this.roleService.getRoleByUuid(command.body.uuid_role))
      return WsResponse.buildNotFoundResponse('ROLE NOT FOUND');

    const user = await this.userService.creteUser(command.body)

    const UserResponse = await this.userService.getUserByUuid(user.uuid)


    return WsResponse.buildOkResponse(
      plainToInstance(UserDto, UserResponse, { excludeExtraneousValues: true }),
    );
  }
}
