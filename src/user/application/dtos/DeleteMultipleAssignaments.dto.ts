import { IsNotEmpty } from 'class-validator';

export class DeleteMultipleAssignamentsDto {
    @IsNotEmpty()
    uuid: string[];
}