import { IsNotEmpty } from 'class-validator';

export class AssingManagerRequestDto {
    @IsNotEmpty()
    uuid_manager: string;
}