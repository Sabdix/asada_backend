import { IsNotEmpty } from 'class-validator';

export class CreateRoleRequestDto {
  @IsNotEmpty()
  name: string;
}

