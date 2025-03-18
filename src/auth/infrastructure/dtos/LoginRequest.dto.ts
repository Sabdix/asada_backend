import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginRequestDto {
  @IsNotEmpty()
  @IsEmail()
  mail: string;
  @IsNotEmpty()
  password: string;
}

