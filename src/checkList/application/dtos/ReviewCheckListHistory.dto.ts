import { IsNotEmpty, IsOptional } from 'class-validator';

export class ReviewCheckListHistoryDto {
    @IsNotEmpty()
    uuid_history: string;

    @IsNotEmpty()
    approved: boolean;

    @IsOptional()
    comment: string;
}

