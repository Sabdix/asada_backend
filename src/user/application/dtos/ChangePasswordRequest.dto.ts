import { IsNotEmpty } from 'class-validator';

export class ChangePasswordRequestDto {
    @IsNotEmpty()
    oldPassword: string;
    @IsNotEmpty()
    newPassword: string;
}