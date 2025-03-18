import { IsNotEmpty } from 'class-validator';

export class UpdateRoleRequestDto {
  @IsNotEmpty()
  name: string;
}
