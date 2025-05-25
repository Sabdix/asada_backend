import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CreateRecipeCategoryRequestDto } from '../../dtos/CreateRecipeCategoryRequest.dto';
import { RecipeCategoryDto } from '../../dtos/RecipeCategory.dto';


export class CreateRecipeCategoryCommand extends Command<WsResponse< RecipeCategoryDto | string>> {
  constructor(public body: CreateRecipeCategoryRequestDto) {
    super();
  }
}
