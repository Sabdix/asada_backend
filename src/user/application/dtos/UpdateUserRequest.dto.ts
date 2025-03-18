import { Optional } from '@nestjs/common';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserRequestDto {
    @Optional()
    name: string;
    @Optional()
    last_name: string;
    @Optional()
    second_last_name: string;
    @Optional()
    phone: string;
    @Optional()
    uuid_role: string;
    @Optional()
    uuid_branch: string;
}

