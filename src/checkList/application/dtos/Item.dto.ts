import { Expose, Type } from "class-transformer";
import { CheckDto } from "./Check.dto";

export class ItemDto {
    @Expose()
    name: string;

    @Expose()
    uuid: string;

    @Expose()
    @Type(() => CheckDto)
    check_list: CheckDto;
}
