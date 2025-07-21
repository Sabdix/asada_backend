import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordRequestDto {
  @IsNotEmpty()
  @IsEmail()
  mail: string;
  @IsNotEmpty()
  phone: string;
  @IsNotEmpty()
  password: string;
}

