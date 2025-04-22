import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBranchReviewRequestDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  comment: string;
  @IsNotEmpty()
  rate: number;
}

