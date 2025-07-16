import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { RecipeCategoryService } from '../../services/RecipeCategory.service';
import { UpdateRecipeCommand } from './UpdateRecipe.command';
import { RecipeService } from '../../services/Recipe.service';
import { RecipeDto } from '../../dtos/Recipe.dto';
import { ConfigService } from '@nestjs/config';


@CommandHandler(UpdateRecipeCommand)
export class UpdateRecipeCommandHandler implements ICommandHandler<UpdateRecipeCommand> {
    constructor(
        private recipeService: RecipeService,
        private recipeCategoryService: RecipeCategoryService,
        private readonly configService: ConfigService
    ) { }

    async execute(command: UpdateRecipeCommand): Promise<WsResponse<RecipeDto | string>> {

        const recipe = await this.recipeService.getRecipeByUuid(command.uuid);

        if (!recipe)
            return WsResponse.buildNotFoundResponse('RECIPE  NOT FOUND');

        recipe.name = command.body.name ?? recipe.name;
        recipe.description = command.body.description ?? recipe.description;
        recipe.uuid_category = command.body.uuid_category ?? recipe.uuid_category;
        recipe.video = command.body.video ?? recipe.video;

        // if (command.updatePdfName == true) {

        //     recipe.pdf = command.pdfFileName
        // }
        // if (command.updateVideoName == true) {

        //     recipe.video = command.videoFileName
        // }
        if (command.updateFile == true) {
            recipe.pdf = command.filePath.replaceAll("\\", "/")
        }

        const recipieCategory = await this.recipeCategoryService.getRecipeCategoryByUuid(recipe.uuid_category)
        if (!recipieCategory)
            return WsResponse.buildNotFoundResponse('RECIPE CATEGORY NOT FOUND');
        recipe.category = recipieCategory

        await this.recipeService.updateRecipe(recipe);

        return WsResponse.buildOkResponse(
            plainToInstance(RecipeDto, recipe, { excludeExtraneousValues: true }),
        );
    }
}
