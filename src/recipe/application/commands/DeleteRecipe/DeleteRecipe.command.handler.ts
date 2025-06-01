import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { DeleteRecipeCommand } from './DeleteRecipe.command';
import { RecipeService } from '../../services/Recipe.service';

@CommandHandler(DeleteRecipeCommand)
export class DeleteRecipeCommandHandler
    implements ICommandHandler<DeleteRecipeCommand> {
    constructor(private readonly recipeService: RecipeService) { }

    async execute(command: DeleteRecipeCommand): Promise<WsResponse<null | string>> {
        const recipe = await this.recipeService.getRecipeByUuid(
            command.uuid,
        );

        if (!recipe)
            return WsResponse.buildNotFoundResponse('RECIPE NOT FOUND');

        await this.recipeService.deleteRecipe(command.uuid);

        return WsResponse.buildOkResponse(null);
    }
}
