import { EntityBase } from '../../../common/entities/EntityBase';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProductCategory } from './ProductCategory.entity';

@Entity()
export class StockProduct extends EntityBase {
  @Column()
  name: string;

  @Column()
  measurementUnit: string;

  @ManyToOne(() => ProductCategory, productCategory => productCategory.stockProducts)
  @JoinColumn({ name: 'uuid_category' }) 
  category: ProductCategory;

  @Column() 
  uuid_category: string;
}