import { EntityBase } from 'src/common/entities/EntityBase';
import { Entity, Column, OneToMany } from 'typeorm';
import { StockProduct } from './StockProduct.entity';

@Entity("product_categories")
export class ProductCategory extends EntityBase {

  @Column() 
  name: string;

  @OneToMany(() => StockProduct, stockProduct => stockProduct.category)
  stockProducts: StockProduct[];
}