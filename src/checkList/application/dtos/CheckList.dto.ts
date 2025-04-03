import { Expose, Type } from 'class-transformer';
import { CheckListItemDto } from './CheckListItem.dto';

export class CheckListDto {
    @Expose()
    name: string;
  
    @Expose()
    uuid: string;

    @Expose()
    @Type(() => CheckListItemDto)
    checkListItem?: CheckListItemDto[];
}