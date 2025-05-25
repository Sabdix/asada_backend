import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { RecipeCategoryDto } from '../../dtos/RecipeCategory.dto';
import { UpdateRecipeCategoryRequestDto } from '../../dtos/UpdateRecupeCategory.dto';


export class UpdateRecipeCategoryCommand extends Command<WsResponse<RecipeCategoryDto | string>> {
  constructor(public body: UpdateRecipeCategoryRequestDto, public uuid: string
  ) {
    super();
  }
}
