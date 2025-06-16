import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { RecipeCategoryService } from '../../services/RecipeCategory.service';
import { CreateRecipeCommand } from './CreateRecipe.command';
import { RecipeDto } from '../../dtos/Recipe.dto';
import { RecipeService } from '../../services/Recipe.service';
import { ConfigService } from '@nestjs/config';

@CommandHandler(CreateRecipeCommand)
export class CreateRecipeCommandHandler implements ICommandHandler<CreateRecipeCommand> {
    constructor(
        private recipeService: RecipeService,
        private recipeCategoryService: RecipeCategoryService,
        private readonly configService: ConfigService
    ) { }

    async execute(command: CreateRecipeCommand): Promise<WsResponse<RecipeDto | string>> {

        const recipeCategory = await this.recipeCategoryService.getRecipeCategoryByUuid(command.body.uuid_category)

        if (!recipeCategory)
            return WsResponse.buildNotFoundResponse('RECIPE CATEGORY NOT FOUND');
        
        const recipe = await this.recipeService.creteRecipe(command.body, command.pdfUrl, recipeCategory, command.videoUrl)

        return WsResponse.buildOkResponse(
            plainToInstance(RecipeDto, recipe, { excludeExtraneousValues: true }),
        );
    }
}
