import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { DeleteRecipeCategoryCommand } from './DeleteCategory.command';
import { RecipeCategoryService } from '../../services/RecipeCategory.service';

@CommandHandler(DeleteRecipeCategoryCommand)
export class DeleteRecipeCategoryCommandHandler
    implements ICommandHandler<DeleteRecipeCategoryCommand> {
    constructor(private readonly recipeCategoryService: RecipeCategoryService) { }

    async execute(command: DeleteRecipeCategoryCommand): Promise<WsResponse<null | string>> {
        const recipeCategory = await this.recipeCategoryService.getRecipeCategoryByUuid(
            command.uuid,
        );

        if (!recipeCategory)
            return WsResponse.buildNotFoundResponse('RECIPE CATEGORY NOT FOUND');

        await this.recipeCategoryService.deleteRecipeCategory(command.uuid);

        return WsResponse.buildOkResponse(null);
    }
}
