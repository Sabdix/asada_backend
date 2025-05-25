import {  Module } from "@nestjs/common";
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


@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([Recipe, RecipeCategory])
    ],
    providers: [
        RecipeCategoryRepository,

        RecipeCategoryService,

        CreateRecipeCategoryCommandHandler,

        GetRecipeCategoryByUuidQueryHandler,
        GetRecipeCategoriesQueryHandler,
        DeleteRecipeCategoryCommandHandler,
        UpdateRecipeCategoryCommandHandler
    ],
    exports: [
        RecipeCategoryService
    ],
    controllers: [recipeController]
})
export class RecipeModule { }