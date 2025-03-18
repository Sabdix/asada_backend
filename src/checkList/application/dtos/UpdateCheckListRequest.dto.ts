import { IsNotEmpty } from 'class-validator';

export class UpdateCheckListRequestDto {
  @IsNotEmpty()
  name: string;
}
