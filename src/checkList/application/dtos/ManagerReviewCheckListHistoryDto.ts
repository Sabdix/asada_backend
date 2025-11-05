import { IsNotEmpty, IsOptional } from 'class-validator';

export class ManagerReviewCheckListHistoryDto {
    @IsNotEmpty()
    uuid_history: string;

    @IsNotEmpty()
    managerApproved: boolean;

    @IsOptional()
    managerComment: string;
}

