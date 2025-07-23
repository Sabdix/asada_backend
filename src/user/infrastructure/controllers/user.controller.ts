import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AssignScheduleCommand } from "src/user/application/commands/AssginSchedule/AssignSchedule.command";
import { AssignCheckListCommand } from "src/user/application/commands/AssignCheckList/AssignCheckList.command";
import { AssignManagerCommand } from "src/user/application/commands/AssignManager/AssignManager.command";
import { ChangePasswordCommand } from "src/user/application/commands/ChangePassword/ChangePassword.command";
import { CreateUserCommand } from "src/user/application/commands/CreateUser/CreateUser.command";
import { DeleteMultipleUserAssignamentCommand } from "src/user/application/commands/DeleteMultipleUserAssignament/DeleteMultipleUserAssignament.command";
import { DeleteUserCommand } from "src/user/application/commands/DeleteUser/DeleteUser.command";
import { DeleteUserAssignamentCommand } from "src/user/application/commands/DeleteUserAssignament/DeleteUserAssignament.command";
import { ChangeEmpoweredStatusCommand } from "src/user/application/commands/ChangeEmpoweredStatus/ChangeEmpoweredStatus.command";
import { UpdateUserCommand } from "src/user/application/commands/UpdateUser/UpdateUser.command";
import { AssingManagerRequestDto } from "src/user/application/dtos/AssignManagerRequest.dto";
import { AssingScheduleRequestDto } from "src/user/application/dtos/AssignScheduleRequest.dto";
import { AssingCheckListRequestDto } from "src/user/application/dtos/AssingCheckListRequest.dto";
import { ChangePasswordRequestDto } from "src/user/application/dtos/ChangePasswordRequest.dto";
import { CreateUserRequestDto } from "src/user/application/dtos/CreateUserRequest.dto";
import { DeleteMultipleAssignamentsDto } from "src/user/application/dtos/DeleteMultipleAssignaments.dto";
import { UpdateUserRequestDto } from "src/user/application/dtos/UpdateUserRequest.dto";
import { GetAssignedCheckListQuery } from "src/user/application/queries/GetAssignedCheckList/GetAssignedCheckList.query";
import { GetUsersQuery } from "src/user/application/queries/GetUsers/GetUsers.query";
import { GetUsersByBranchQuery } from "src/user/application/queries/GetUsersByBranch/GetUsersByBranch.query";
import { GetAllWorkAreaQuery } from "src/user/application/queries/GetAllWorkArea/GetAllWorkArea.query";
import { AssingWorkAreaRequestDto } from "src/user/application/dtos/AssignWorkAreaRequest.dto";
import { AssignWorkAreaCommand } from "src/user/application/commands/AssignWorkArea/AssignWorkArea.command";
import { UnassignManagerCommand } from "src/user/application/commands/UnassignManager/UnassignManager.command";

@Controller('user')
export class UserController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) { }

    @Get()
    async getUsers(@Query('size') size:number, @Query('offset') offset:number) {
        return this.queryBus.execute(new GetUsersQuery(size, offset));
    }

    @Post('create')
    async createRole(@Body() createUserRequestDto: CreateUserRequestDto) {
        return this.commandBus.execute(new CreateUserCommand(createUserRequestDto));
    }

    @Delete('/:uuid')
    async deleteUser(@Param('uuid') uuid: string) {
        return this.commandBus.execute(new DeleteUserCommand(uuid));
    }

    @Put('/:uuid')
    async UpdateUser(@Param('uuid') uuid: string, @Body() request: UpdateUserRequestDto) {
        return this.commandBus.execute(new UpdateUserCommand(request, uuid));
    }

    @Post('assign-manager/:uuid')
    async AssignManagerToUser(@Param('uuid') uuid: string, @Body() request: AssingManagerRequestDto) {
        return this.commandBus.execute(new AssignManagerCommand(request, uuid));
    }

    @Patch('change-password/:uuid')
    async ChangePassword(@Param('uuid') uuid: string, @Body() request: ChangePasswordRequestDto) {
        return this.commandBus.execute(new ChangePasswordCommand(request, uuid));
    }

    @Put('change-password/:uuid')
    async ChangePasswordPut(@Param('uuid') uuid: string, @Body() request: ChangePasswordRequestDto) {
        return this.commandBus.execute(new ChangePasswordCommand(request, uuid));
    }

    @Post('assign-checklist/:uuid')
    async AssignCheckListToUser(@Param('uuid') uuid: string, @Body() request: AssingCheckListRequestDto) {
        return this.commandBus.execute(new AssignCheckListCommand(request, uuid));
    }

    @Get('assigned-checklist/:uuid')
    async AssignedCheckList(@Param('uuid') uuid: string) {
        return this.queryBus.execute(new GetAssignedCheckListQuery(uuid));
    }

    @Delete('assignament/:uuid')
    async deleteUserAssignament(@Param('uuid') uuid: string) {
        return this.commandBus.execute(new DeleteUserAssignamentCommand(uuid));
    }

    @Delete('multiple/assignament')
    async deleteMultipleUserAssignament(@Body() request: DeleteMultipleAssignamentsDto) {
        return this.commandBus.execute(new DeleteMultipleUserAssignamentCommand(request));
    }

    @Get('get-users-by-branch/:uuid')
    async GetUsersByBranch(@Param('uuid') uuid: string) {
        return this.queryBus.execute(new GetUsersByBranchQuery(uuid));
    }

    @Post('assign-schedule/:uuid')
    async AssignScheduleToUser(@Param('uuid') uuid: string, @Body() request: AssingScheduleRequestDto) {
        return this.commandBus.execute(new AssignScheduleCommand(request, uuid));
    }

    @Post('change-empowered-status/:uuid')
    async empowerUser(@Param('uuid') uuid: string) {
        return this.commandBus.execute(new ChangeEmpoweredStatusCommand(uuid));
    }

    @Get('work-area')
    async getAllWorkArea() {
        return this.queryBus.execute(new GetAllWorkAreaQuery());
    }

    @Post('assign-work-area/:uuid')
    async AssignWorkAreaToUser(@Param('uuid') uuid: string, @Body() request: AssingWorkAreaRequestDto) {
        return this.commandBus.execute(new AssignWorkAreaCommand(request, uuid));
    }

    @Post('unassign-manager/:uuid')
    async UnassignManagerToUser(@Param('uuid') uuid: string) {
        return this.commandBus.execute(new UnassignManagerCommand(uuid));
    }
}
