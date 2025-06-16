import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RecipeCategory } from "./domain/entities/RecipeCategory.entity";
import { Recipe } from "./domain/entities/Recipe.entity";
import { recipeController } from "./infrastructure/controllers/recipe.controller";
import { RecipeCategoryService } from "./application/services/RecipeCategory.service";
import { RecipeCategoryRepository } from "./infrastructure/repositories/recipeCategory.repository";
import { CreateRecipeCategoryCommandHandler } from "./application/commands/CreateRecipeCategory/CreateRecipeCategory.command.handler";
import { GetRecipeCategoryByUuidQueryHandler } from "./application/queries/GetRecipeCategoryByUuid/GetRecipeCategoryByUuid.query.handler";
import { GetRecipeCategoriesQueryHandler } from "./application/queries/GetRecipeCategories/GetRecipeCategories.query,handler";
import { DeleteRecipeCategoryCommandHandler } from "./application/commands/DeleteRecipeCategory/DeleteCategory.command.handler";
import { UpdateRecipeCategoryCommandHandler } from "./application/commands/UpdateRecipeCategory/UpdateRecipeCategory.command.handler";
import { CreateRecipeCommandHandler } from "./application/commands/CreateRecipe/CreateRecipe.command.handler";
import { RecipeService } from "./application/services/Recipe.service";
import { RecipeRepository } from "./infrastructure/repositories/recipe.repository";
import { MulterModule } from "@nestjs/platform-express";
import { GetRecipesQueryHandler } from "./application/queries/GetRecipes/GetRecipes.query.handler";
import { GetRecipeByUuidQueryHandler } from "./application/queries/GetRecipeByUuid/GetRecipeByUuid.query.handler";
import { DeleteRecipeCommandHandler } from "./application/commands/DeleteRecipe/DeleteRecipe.command.handler";
import { UpdateRecipeCommandHandler } from "./application/commands/UpdateRecipe/UpdateRecipe.command.handler";
import { GetRecipePdfQueryHandler } from "./application/queries/GetRecipePdf/GetRecipePdf.query.handler";
import { GetRecipeVideoQueryHandler } from "./application/queries/GetRecipeVideo/GetRecipeVideo.query.handler";


@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([Recipe, RecipeCategory]),
        MulterModule.register({
            dest: '../../media/recipe/pdfs',
        }),
    ],
    providers: [
        RecipeRepository,
        RecipeCategoryRepository,

        RecipeService,
        RecipeCategoryService,

        GetRecipesQueryHandler,
        GetRecipeByUuidQueryHandler,
        GetRecipePdfQueryHandler,
        GetRecipeVideoQueryHandler,

        CreateRecipeCategoryCommandHandler,
        DeleteRecipeCommandHandler,
        UpdateRecipeCommandHandler,

        GetRecipeCategoryByUuidQueryHandler,
        GetRecipeCategoriesQueryHandler,

        DeleteRecipeCategoryCommandHandler,
        UpdateRecipeCategoryCommandHandler,
        CreateRecipeCommandHandler
    ],
    exports: [
        RecipeCategoryService,
        RecipeService
    ],
    controllers: [recipeController]
})
export class RecipeModule { }