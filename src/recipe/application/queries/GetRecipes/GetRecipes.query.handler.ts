import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetRecipesQuery } from './GetRecipes.query';
import { RecipeService } from '../../services/Recipe.service';
import { RecipeDto } from '../../dtos/Recipe.dto';

@QueryHandler(GetRecipesQuery)
export class GetRecipesQueryHandler implements IQueryHandler<GetRecipesQuery> {
  constructor(private  recipeService: RecipeService) {}

  async execute() {
    const recipes = await this.recipeService.getRecipes();

    return WsResponse.buildOkResponse(
      plainToInstance(RecipeDto, recipes, { excludeExtraneousValues: true }),
    );
  }
}
