import { IsNotEmpty } from 'class-validator';

export class AssingCheckListRequestDto {
    @IsNotEmpty()
    uuid_check_list: string;
    @IsNotEmpty()
    weekDay: string[];
    @IsNotEmpty()
    initHour: string;
    @IsNotEmpty()
    endHour: string;
}