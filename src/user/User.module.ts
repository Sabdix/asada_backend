import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UserService } from "./application/services/user.service";
import { UserRepository } from "./infrastructure/repositories/user.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./domain/entities/User.entity";
import { RoleService } from "./application/services/role.service";
import { RoleRepository } from "./infrastructure/repositories/role.repository";
import { Role } from "./domain/entities/Role.entity";
import { UserController } from "./infrastructure/controllers/user.controller";
import { RoleController } from "./infrastructure/controllers/role.controller";
import { CreateRoleCommandHandler } from "./application/commands/CreateRole/CreateRole.command.handler";
import { GetRoleByUuidQueryHandler } from "./application/queries/GetRoleByUuid/GetRoleByUuid.query.handler";
import { GetRolesQueryHandler } from "./application/queries/GetRoles/GetRoles.query.handler";
import { GetUsersQueryHandler } from "./application/queries/GetUsers/GetUsers.query.handler";
import { CreateUserCommandHandler } from "./application/commands/CreateUser/CreateUser.command.handler";
import { DeleteRoleCommandHandler } from "./application/commands/DeleteRole/DeleteRole.command.handler";
import { DeleteUserCommandHandler } from "./application/commands/DeleteUser/DeleteUser.command.handler";
import { UpdateRoleCommandHandler } from "./application/commands/UpdateRole/UpdateRole.command.handler";
import { UpdateUserCommandHandler } from "./application/commands/UpdateUser/UpdateUser.command.handler";
import { BranchService } from "src/branch/application/services/Branch.service";
import { BranchRepository } from "src/branch/infrastructure/repositories/branch.repository";
import { BranchModule } from "src/branch/Branch.module";
import { Branch } from "src/branch/domain/entities/Branch.entity";
import { AssignManagerCommandHandler } from "./application/commands/AssignManager/AssingManager.command.handler";
import { ChangePasswordCommandHandler } from "./application/commands/ChangePassword/ChangePassword.command.handler";
import { AssignCheckListCommandHandler } from "./application/commands/AssignCheckList/AssingCheckList.command.handler";
import { CheckListUserService } from "src/checkList/application/services/checkListUser.service";
import { CheckListUserRepository } from "src/checkList/infrastructure/repositories/CheckListUser.Repository";
import { CheckListUser } from "src/checkList/domain/entities/CheckListUser.entity";
import { CheckListModule } from "src/checkList/CheckList.module";
import { GetAssignedCheckListQueryHandler } from "./application/queries/GetAssignedCheckList/GetAssignerCheckList.query.handler";
import { DeleteUserAssignamentCommandHandler } from "./application/commands/DeleteUserAssignament/DeleteUserAssignament.command.handler";
import { GetUsersByBranchQueryHandler } from "./application/queries/GetUsersByBranch/GetUsersByBranch.query.handler";
import { ScheduleLocalModule } from "src/schedule/ScheduleLocal.module";
import { Schedule } from "src/schedule/domain/entities/Schedule.entity";
import { ScheduleRepository } from "src/schedule/infrastructure/repositories/Schedule.repository";
import { ScheduleService } from "src/schedule/application/services/schedule.service";
import { AssignScheduleCommandHandler } from "./application/commands/AssginSchedule/AssignSchedule.command.handler";
import { DeleteMultipleUserAssignamentCommandHandler } from "./application/commands/DeleteMultipleUserAssignament/DeleteMultipleUserAssignament.command.handler";
import { ChangeEmpoweredStatusCommandHandler } from "./application/commands/ChangeEmpoweredStatus/ChangeEmpowered.command.handler";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([User, Role, Branch, CheckListUser, Schedule]),
        BranchModule,
        forwardRef(() =>CheckListModule),
        ScheduleLocalModule
    ],
    providers: [
        UserService,
        UserRepository,
        RoleService,
        RoleRepository,
        BranchService,
        BranchRepository,
        CheckListUserService,
        CheckListUserRepository,
        ScheduleService,
        ScheduleRepository,
        CreateRoleCommandHandler,
        GetRoleByUuidQueryHandler,
        GetRolesQueryHandler,
        GetUsersQueryHandler,
        CreateUserCommandHandler,
        DeleteRoleCommandHandler,
        DeleteUserCommandHandler,
        UpdateRoleCommandHandler,
        UpdateUserCommandHandler,
        AssignManagerCommandHandler,
        ChangePasswordCommandHandler,
        AssignCheckListCommandHandler,
        GetAssignedCheckListQueryHandler,
        DeleteUserAssignamentCommandHandler,
        GetUsersByBranchQueryHandler,
        AssignScheduleCommandHandler,
        DeleteMultipleUserAssignamentCommandHandler,
        ChangeEmpoweredStatusCommandHandler
    ],
    exports: [
        UserService,
        RoleService
    ],
    controllers: [UserController, RoleController]
})
export class UserModule { }