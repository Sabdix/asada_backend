import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetRecipeCategoryByUuidQuery } from './GetRecipeCategoryByUuid.query';
import { RecipeCategoryService } from '../../services/RecipeCategory.service';
import { RecipeCategoryDto } from '../../dtos/RecipeCategory.dto';

@QueryHandler(GetRecipeCategoryByUuidQuery)
export class GetRecipeCategoryByUuidQueryHandler implements IQueryHandler<GetRecipeCategoryByUuidQuery> {
  constructor(private  recipeCategoryService: RecipeCategoryService) {}

  async execute(query:GetRecipeCategoryByUuidQuery) {
    const recipeCategory = await this.recipeCategoryService.getRecipeCategoryByUuid(query.uuid);

    if (!recipeCategory) return WsResponse.buildNotFoundResponse('RECIPE CATEGORY NOT FOUND');

    return WsResponse.buildOkResponse(
      plainToInstance(RecipeCategoryDto, recipeCategory, { excludeExtraneousValues: true }),
    );
  }
}
