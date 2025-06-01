import { Injectable } from '@nestjs/common';
import { RecipeCategoryRepository } from 'src/recipe/infrastructure/repositories/recipeCategory.repository';
import { CreateRecipeCategoryRequestDto } from '../dtos/CreateRecipeCategoryRequest.dto';
import { RecipeCategory } from 'src/recipe/domain/entities/RecipeCategory.entity';


@Injectable()
export class RecipeCategoryService {
    constructor(private readonly recipeCategoryRepository: RecipeCategoryRepository) { }

    creteRecipeCategory(request: CreateRecipeCategoryRequestDto) {
        return this.recipeCategoryRepository.save(
            this.recipeCategoryRepository.create({
                name: request.name
            })
        )
    }

    getRecipeCategoryByName(name: string) {
        return this.recipeCategoryRepository.findOneBy({ name: name });
    }

    getRecipeCategoryByUuid(uuid: string) {
        return this.recipeCategoryRepository.findOneBy({ uuid: uuid });
    }

    getRecipeCategories() {
        return this.recipeCategoryRepository.find();
    }

    deleteRecipeCategory(uuid: string) {
        return this.recipeCategoryRepository.softDelete({ uuid: uuid });
    }

    updateRecipeCategory(recipeCategory: RecipeCategory) {
        return this.recipeCategoryRepository.save(recipeCategory);
    }

}
