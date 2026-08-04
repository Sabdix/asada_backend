import { IsNotEmpty, ValidateIf } from 'class-validator';

export class AssingCheckListRequestDto {
    @IsNotEmpty()
    uuid_check_list: string;
    @IsNotEmpty()
    weekDay: number[];
    @IsNotEmpty()
    initHour: string;
    @IsNotEmpty()
    endHour: string;
    @IsNotEmpty()
    specialEvent: boolean;
    @ValidateIf((o) => o.specialEvent === true)
    @IsNotEmpty()
    eventDate: Date;
}