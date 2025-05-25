import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeCategory } from 'src/recipe/domain/entities/RecipeCategory.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecipeCategoryRepository extends Repository<RecipeCategory> {
  constructor(@InjectRepository(RecipeCategory) private readonly repo: Repository<RecipeCategory>) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
  
}