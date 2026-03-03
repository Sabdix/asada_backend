import { IsNotEmpty, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CheckListWithPriorityDto {
  @IsNotEmpty()
  uuid_check_list: string;

  @IsNumber()
  priority: number;
}

export class UpdateCheckListGroupRequestDto {
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckListWithPriorityDto)
  checkLists: CheckListWithPriorityDto[];
}
