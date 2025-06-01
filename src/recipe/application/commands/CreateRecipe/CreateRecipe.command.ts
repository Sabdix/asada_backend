import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CreateRecipeRequestDto } from '../../dtos/CreateRecipeRequest.dto';
import { RecipeDto } from '../../dtos/Recipe.dto';


export class CreateRecipeCommand extends Command<WsResponse< RecipeDto | string>> {
  constructor(public body: CreateRecipeRequestDto, public pdfUrl: string) {
    super();
  }
}
