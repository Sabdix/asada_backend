import { IsNotEmpty } from 'class-validator';

export class DuplicateCheckListRequestDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    uuid_check_list: string;
}

