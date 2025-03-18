import { IsNotEmpty } from 'class-validator';

export class CreateCheckListRequestDto {
  @IsNotEmpty()
  name: string;
}

