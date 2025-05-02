import { Expose, Type } from "class-transformer";
import { ItemDto } from "./Item.dto";

export class CriteriaDto{
    @Expose()
    text: string;
  
    @Expose()
    uuid: string;

    @Expose()
    @Type(() => ItemDto)
    checkListItem: ItemDto;

}
