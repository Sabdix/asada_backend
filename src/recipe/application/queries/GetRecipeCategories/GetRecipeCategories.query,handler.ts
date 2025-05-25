import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { RecipeCategoryService } from '../../services/RecipeCategory.service';
import { RecipeCategoryDto } from '../../dtos/RecipeCategory.dto';
import { GetRecipeCategoriesQuery } from './GetRecipeCategories.query';

@QueryHandler(GetRecipeCategoriesQuery)
export class GetRecipeCategoriesQueryHandler implements IQueryHandler<GetRecipeCategoriesQuery> {
  constructor(private  recipeCategoryService: RecipeCategoryService) {}

  async execute() {
    const recipeCategory = await this.recipeCategoryService.getRecipeCategories();

    if (!recipeCategory) return WsResponse.buildNotFoundResponse('RECIPE CATEGORY NOT FOUND');

    return WsResponse.buildOkResponse(
      plainToInstance(RecipeCategoryDto, recipeCategory, { excludeExtraneousValues: true }),
    );
  }
}
