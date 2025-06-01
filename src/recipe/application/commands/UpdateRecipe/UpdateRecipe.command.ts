import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { RecipeDto } from '../../dtos/Recipe.dto';
import { UpdateRecipeRequestDto } from '../../dtos/UpdateRecipeRequest.dto';


export class UpdateRecipeCommand extends Command<WsResponse<RecipeDto | string>> {
  constructor(public body: UpdateRecipeRequestDto, public uuid: string, public filePath: string, public updateFile: boolean
  ) {
    super();
  }
}
