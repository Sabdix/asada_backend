import { Entity, Column, OneToMany } from 'typeorm';
import { EntityBase } from '../../../common/entities/EntityBase';
import { Recipe } from './Recipe.entity';


@Entity('recipe_categories') 
export class RecipeCategory extends EntityBase {

  @Column()
  name: string;

  @OneToMany(() => Recipe, (recipe) => recipe.category)
  recipes: Recipe[];
}