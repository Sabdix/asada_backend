import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { RecipeCategoryDto } from '../../dtos/RecipeCategory.dto';
import { GetRecipeByUuidQuery } from './GetRecipeByUuid.query';
import { RecipeService } from '../../services/Recipe.service';
import { RecipeDto } from '../../dtos/Recipe.dto';

@QueryHandler(GetRecipeByUuidQuery)
export class GetRecipeByUuidQueryHandler implements IQueryHandler<GetRecipeByUuidQuery> {
  constructor(private  recipeService: RecipeService) {}

  async execute(query:GetRecipeByUuidQuery) {
    const recipe = await this.recipeService.getRecipeByUuid(query.uuid);

    if (!recipe) return WsResponse.buildNotFoundResponse('RECIPE NOT FOUND');

    return WsResponse.buildOkResponse(
      plainToInstance(RecipeDto, recipe, { excludeExtraneousValues: true }),
    );
  }
}
