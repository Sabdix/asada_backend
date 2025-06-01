import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { RecipeDto } from '../../dtos/Recipe.dto';

export class GetRecipeByUuidQuery extends Query<WsResponse<RecipeDto | string>> {
  constructor(public readonly uuid: string) {
    super();
  }
}
