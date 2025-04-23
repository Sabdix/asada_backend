import { IsNotEmpty } from 'class-validator';

export class CreateCheckListHistoryRequestDto {
    @IsNotEmpty()
    date: Date;
    @IsNotEmpty()
    status: boolean;
    @IsNotEmpty()
    uuid_check_list: string;
    @IsNotEmpty()
    uuid_user: string;
    @IsNotEmpty()
    uuid_check_list_user: string;
}

