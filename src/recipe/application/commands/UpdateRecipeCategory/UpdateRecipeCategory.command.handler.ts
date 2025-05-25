import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateRecipeCategoryCommand } from './UpdateRecipeCategory.command';
import { RecipeCategoryDto } from '../../dtos/RecipeCategory.dto';
import { RecipeCategoryService } from '../../services/RecipeCategory.service';


@CommandHandler(UpdateRecipeCategoryCommand)
export class UpdateRecipeCategoryCommandHandler implements ICommandHandler<UpdateRecipeCategoryCommand> {
    constructor(
        private recipeCategoryService: RecipeCategoryService,
    ) { }

    async execute(command: UpdateRecipeCategoryCommand): Promise<WsResponse<RecipeCategoryDto | string>> {

        const recipeCategory = await this.recipeCategoryService.getRecipeCategoryByUuid(command.uuid);

        if (!recipeCategory)
            return WsResponse.buildNotFoundResponse('RECIPE CATEGORY NOT FOUND');

        recipeCategory.name = command.body.name;
        await this.recipeCategoryService.updateRecipeCategory(recipeCategory);

        return WsResponse.buildOkResponse(
            plainToInstance(RecipeCategoryDto, recipeCategory, { excludeExtraneousValues: true }),
        );
    }
}
