import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CreateUserCommand } from './CreateUser.command';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../dtos/User.dto';
import { RoleService } from '../../services/role.service';
import { WorkAreaService } from '../../services/workArea.service';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private workAreaService: WorkAreaService
  ) { }

  async execute(command: CreateUserCommand): Promise<WsResponse<UserDto | string>> {

    if (await this.userService.getUserByMail(command.body.mail))
      return WsResponse.buildConflictResponse('YA EXISTE UN USUARIO CON ESE CORREO ELECTRONICO', 'USER ALREADY EXISTS');

    const role = await this.roleService.getRoleByUuid(command.body.uuid_role)
    if (!role)
      return WsResponse.buildNotFoundResponse('ROLE NOT FOUND');

    if (! await this.workAreaService.getWorkAreaByUuid(command.body.uuid_work_area))
      return WsResponse.buildNotFoundResponse('WORK_AREA NOT FOUND');

    const user = await this.userService.creteUser(command.body)

    if (Number(role.hierarchy) == 4) {
      const hierarchy = (Number(role.hierarchy) - 1).toString()

      const superiorRole = await this.roleService.getRoleByHierarchy(hierarchy, role.uuid_work_area)

      const manager = await this.userService.GetUserByBranchAndRole(user.uuid_branch, superiorRole?.uuid)

      user.manager = manager
      await this.userService.UpdateUser(user)
    } else if (Number(role.hierarchy) == 3) {
      const hierarchy = (Number(role.hierarchy) - 1).toString()

      const superiorRole = await this.roleService.getRoleByName("Gerente Sucursal")

      const manager = await this.userService.GetUserByBranchAndRole(user.uuid_branch, superiorRole?.uuid)

      user.manager = manager
      await this.userService.UpdateUser(user)
    }

    const UserResponse = await this.userService.getUserByUuid(user.uuid)

    return WsResponse.buildOkResponse(
      plainToInstance(UserDto, UserResponse, { excludeExtraneousValues: true }),
    );
  }
}
