import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';import { CreateRecipeCategoryCommand } from './CreateRecipeCategory.command';
import { RecipeCategoryDto } from '../../dtos/RecipeCategory.dto';
import { RecipeCategoryService } from '../../services/RecipeCategory.service';
;

@CommandHandler(CreateRecipeCategoryCommand)
export class CreateRecipeCategoryCommandHandler implements ICommandHandler<CreateRecipeCategoryCommand> {
  constructor(
    private recipeCategoryService: RecipeCategoryService,
  ) {}

  async execute(command: CreateRecipeCategoryCommand): Promise<WsResponse<RecipeCategoryDto | string>> {

    if (await this.recipeCategoryService.getRecipeCategoryByName(command.body.name))
        return WsResponse.buildConflictResponse('YA EXISTE UNA CATEGORIA CON ESE NOMBRE','RECIPE CATEGORY ALREADY EXISTS');

    const recipeCategory = await this.recipeCategoryService.creteRecipeCategory(command.body)

    return WsResponse.buildOkResponse(
      plainToInstance(RecipeCategoryDto, recipeCategory, { excludeExtraneousValues: true }),
    );
  }
}
