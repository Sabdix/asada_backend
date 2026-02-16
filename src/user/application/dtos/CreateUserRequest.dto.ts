import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserRequestDto {
    @IsNotEmpty()
    @IsEmail()
    mail: string;
    @IsEmail({}, { message: 'El formato del correo electrónico no es válido' })
    mail_alertas: string;
    @IsNotEmpty()
    password: string;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    last_name: string;
    @IsNotEmpty()
    second_last_name: string;
    @IsNotEmpty()
    phone: string;
    @IsNotEmpty()
    uuid_role: string;
    @IsNotEmpty()
    uuid_branch: string;
    @IsNotEmpty()
    uuid_work_area: string;
}

