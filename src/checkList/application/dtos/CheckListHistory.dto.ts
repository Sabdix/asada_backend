import { Expose, Type } from 'class-transformer';
import { CheckListUserDto } from './CheckListUser.dto';
import { UserDto } from 'src/user/application/dtos/User.dto';

export class CheckListHistoryDto {
    @Expose()
    uuid: string;
    @Expose()
    date: Date;
    @Expose()
    status: boolean;
    @Expose()
    comment: string;
    @Expose()
    approved: boolean;
    @Expose()
    revised: boolean;

    @Expose()
    @Type(() => CheckListUserDto)
    check_list_user: CheckListUserDto;

    @Expose()
    @Type(() => UserDto)
    user?: UserDto;

}