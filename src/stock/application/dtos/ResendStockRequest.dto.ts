import { IsEmail, IsOptional, IsString } from 'class-validator';

export class ResendStockRequestDto {
  @IsEmail()
  to: string;

  @IsOptional()
  @IsString()
  cc?: string;

  @IsOptional()
  @IsString()
  subject?: string;
}
