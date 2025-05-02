import { Expose, Type } from 'class-transformer';
import { CheckListUserDto } from './CheckListUser.dto';

export class CheckListHistoryDto {
    @Expose()
    uuid: string;
    @Expose()
    date: Date;
    @Expose()
    status: boolean;

    @Expose()
    @Type(() => CheckListUserDto)
    check_list_user: CheckListUserDto;

}