import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from 'src/stock/domain/entities/ProductCategory.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductCategoryRepository extends Repository<ProductCategory> {
  constructor(@InjectRepository(ProductCategory) private readonly repo: Repository<ProductCategory>) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
  
}