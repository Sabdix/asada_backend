import { Injectable } from '@nestjs/common';
import { RecipeRepository } from 'src/recipe/infrastructure/repositories/recipe.repository';
import { CreateRecipeRequestDto } from '../dtos/CreateRecipeRequest.dto';
import { RecipeCategory } from 'src/recipe/domain/entities/RecipeCategory.entity';
import { Recipe } from 'src/recipe/domain/entities/Recipe.entity';


@Injectable()
export class RecipeService {
    constructor(private readonly recipeRepository: RecipeRepository) { }

    creteRecipe(request: CreateRecipeRequestDto, pdfUrl: string, recipeCategory: RecipeCategory, videoUrl: string) {
        return this.recipeRepository.save(
            this.recipeRepository.create({
                name: request.name,
                description: request.description,
                pdf: pdfUrl,
                video: videoUrl,
                category: recipeCategory
            })
        )
    }

    getRecipeByName(name: string) {
        return this.recipeRepository.findOneBy({ name: name });
    }

    getRecipeByUuid(uuid: string) {
        // return this.recipeRepository.findOne({
        //     where: { uuid: uuid },
        //     relations: ['category'], withDeleted: true
        // });

        return this.recipeRepository
            .createQueryBuilder('recipe') // Alias para la tabla de recipes
            .leftJoinAndSelect('recipe.category', 'category', 'category.deletedAt IS NOT NULL OR category.deletedAt IS NULL')
            .where('recipe.uuid = :uuid', { uuid })
            .andWhere('recipe.deletedAt IS NULL') 
            .getOne();
    }

    getRecipes() {
        //return this.recipeRepository.find({ relations: ['category'], withDeleted: true });
        return this.recipeRepository
            .createQueryBuilder('recipe')
            .leftJoinAndSelect('recipe.category', 'category', 'category.deletedAt IS NOT NULL OR category.deletedAt IS NULL')
            .where('recipe.deletedAt IS NULL')
            .getMany();
    }

    deleteRecipe(uuid: string) {
        return this.recipeRepository.softDelete({ uuid: uuid });
    }

    updateRecipe(recipe: Recipe) {
        return this.recipeRepository.save(recipe);
    }

}
