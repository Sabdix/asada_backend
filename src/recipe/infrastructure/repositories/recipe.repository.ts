import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from 'src/recipe/domain/entities/Recipe.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecipieRepository extends Repository<Recipe> {
  constructor(@InjectRepository(Recipe) private readonly repo: Repository<Recipe>) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
  
}