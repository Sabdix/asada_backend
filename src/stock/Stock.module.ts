import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductCategory } from "./domain/entities/ProductCategory.entity";
import { StockProduct } from "./domain/entities/StockProduct.entity";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([ProductCategory, StockProduct]),
    ],
    providers: [
        // RecipeRepository,
        // RecipeCategoryRepository,

        // RecipeService,
        // RecipeCategoryService,

        // GetRecipesQueryHandler,
        // GetRecipeByUuidQueryHandler,

        // CreateRecipeCategoryCommandHandler,
        // DeleteRecipeCommandHandler,
        // UpdateRecipeCommandHandler,

        // GetRecipeCategoryByUuidQueryHandler,
        // GetRecipeCategoriesQueryHandler,

        // DeleteRecipeCategoryCommandHandler,
        // UpdateRecipeCategoryCommandHandler,
        // CreateRecipeCommandHandler
    ],
    exports: [
        // RecipeCategoryService,
        // RecipeService
    ],
    // controllers: [recipeController]
})
export class StockModule { }