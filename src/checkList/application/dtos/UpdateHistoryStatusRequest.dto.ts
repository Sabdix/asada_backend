import { IsNotEmpty } from 'class-validator';

export class UpdateHistoryStatusRequestDto {
  @IsNotEmpty()
  status: number;
}
