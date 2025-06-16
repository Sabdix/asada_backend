import { IsNotEmpty } from 'class-validator';

export class ReassignHistoryRequestDto {
    @IsNotEmpty()
    uuid_user: string;
}

