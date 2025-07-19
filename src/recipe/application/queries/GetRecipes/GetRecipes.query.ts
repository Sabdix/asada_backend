import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { RecipeDto } from '../../dtos/Recipe.dto';

export class GetRecipesQuery extends Query<WsResponse<RecipeDto[] | string>> {
  constructor(
    public readonly size:number,
    public readonly offset: number
  ) {
    super();
  }
}
