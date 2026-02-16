import { Optional } from '@nestjs/common';

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
    mail_alertas: string;
    @Optional()
    uuid_role: string;
    @Optional()
    uuid_branch: string;
    @Optional()
    uuid_work_area: string;
}

