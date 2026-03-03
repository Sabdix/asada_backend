
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { EntityBase } from '../../../common/entities/EntityBase';
import { RecipeCategory } from './RecipeCategory.entity';


@Entity('recipes')
export class Recipe extends EntityBase {

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  pdf: string;

  @Column({ nullable: true }) 
  video: string;

  @Column()
  uuid_category: string;

  @ManyToOne(() => RecipeCategory, (category) => category.recipes, {})
  @JoinColumn({ name: 'uuid_category' }) 
  category: RecipeCategory;
}