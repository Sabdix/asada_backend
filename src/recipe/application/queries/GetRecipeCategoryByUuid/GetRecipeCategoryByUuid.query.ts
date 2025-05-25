import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { RecipeCategoryDto } from '../../dtos/RecipeCategory.dto';

export class GetRecipeCategoryByUuidQuery extends Query<WsResponse<RecipeCategoryDto | string>> {
  constructor(public readonly uuid: string) {
    super();
  }
}
