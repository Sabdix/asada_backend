import { Injectable } from '@nestjs/common';
import { RecipeRepository } from 'src/recipe/infrastructure/repositories/recipe.repository';
import { CreateRecipeRequestDto } from '../dtos/CreateRecipeRequest.dto';
import { RecipeCategory } from 'src/recipe/domain/entities/RecipeCategory.entity';
import { Recipe } from 'src/recipe/domain/entities/Recipe.entity';
import { take } from 'rxjs';


@Injectable()
export class RecipeService {
    constructor(private readonly recipeRepository: RecipeRepository) { }

    // creteRecipe(request: CreateRecipeRequestDto, pdfUrl: string, recipeCategory: RecipeCategory, videoUrl: string) {
    creteRecipe(request: CreateRecipeRequestDto, pdfUrl: string, recipeCategory: RecipeCategory) {
        return this.recipeRepository.save(
            this.recipeRepository.create({
                name: request.name,
                description: request.description,
                pdf: pdfUrl,
                video: request.video,
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

    getRecipesPaginated(size: number, offset: number, name: string, category: string) {
        //return this.recipeRepository.find({ relations: ['category'], withDeleted: true });
        // return this.recipeRepository
        //     .createQueryBuilder('recipe')
        //     .leftJoinAndSelect('recipe.category', 'category', 'category.deletedAt IS NOT NULL OR category.deletedAt IS NULL')
        //     .where('recipe.deletedAt IS NULL')
        //     .take(size)
        //     .skip(offset)
        //     .getManyAndCount();

        const queryBuilder = this.recipeRepository
            .createQueryBuilder('recipe')
            .leftJoinAndSelect('recipe.category', 'category', 'category.deletedAt IS NOT NULL OR category.deletedAt IS NULL')
            .where('recipe.deletedAt IS NULL')

        if (name) {
            queryBuilder.andWhere(`LOWER(recipe.name) LIKE LOWER(:name)`, { name: `%${name}%` });
        }
        if (category) {
            queryBuilder.andWhere(`LOWER(category.name) LIKE LOWER(:category)`, { category: `%${category}%` });
        }

        queryBuilder.take(size).skip(offset);

        return queryBuilder.getManyAndCount();
    }

    deleteRecipe(uuid: string) {
        return this.recipeRepository.softDelete({ uuid: uuid });
    }

    updateRecipe(recipe: Recipe) {
        return this.recipeRepository.save(recipe);
    }

}
