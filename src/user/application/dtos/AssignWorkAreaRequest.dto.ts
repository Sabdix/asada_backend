import { IsNotEmpty } from 'class-validator';

export class AssingWorkAreaRequestDto {
    @IsNotEmpty()
    uuid_work_area: string;
}