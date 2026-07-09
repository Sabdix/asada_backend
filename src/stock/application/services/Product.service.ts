import { Injectable } from '@nestjs/common';
import { StockProductRepository } from 'src/stock/infrastructure/repositories/StockProduct.repository';
import { CreateProductRequestDto } from '../dtos/CreateProductRequest.dto';
import { StockProduct } from 'src/stock/domain/entities/StockProduct.entity';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: StockProductRepository) {}

  creteProduct(request: CreateProductRequestDto) {
    return this.productRepository.save(
      this.productRepository.create({
        name: request.name,
        measurementUnit: request.measurementUnit,
        uuid_category: request.uuid_category,
      }),
    );
  }

  getProductByName(name: string) {
    return this.productRepository.findOneBy({ name: name });
  }

  getProductByUuid(uuid: string) {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect(
        'product.category',
        'category',
        'category.deletedAt IS NOT NULL OR category.deletedAt IS NULL',
      )
      .where('product.uuid = :uuid', { uuid })
      .andWhere('product.deletedAt IS NULL')
      .getOne();
  }

  getProducts() {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect(
        'product.category',
        'category',
        'category.deletedAt IS NOT NULL OR category.deletedAt IS NULL',
      )
      .andWhere('product.deletedAt IS NULL')
      .getMany();
  }

  getProductsPaginated(
    size: number,
    offset: number,
    name: string,
    category: string,
  ) {
    // return this.productRepository
    //     .createQueryBuilder('product')
    //     .leftJoinAndSelect(
    //         'product.category',
    //         'category',
    //         'category.deletedAt IS NOT NULL OR category.deletedAt IS NULL'
    //     )
    //     .andWhere('product.deletedAt IS NULL')
    //     .take(size)
    //     .skip(offset)
    //     .getManyAndCount();

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect(
        'product.category',
        'category',
        'category.deletedAt IS NOT NULL OR category.deletedAt IS NULL',
      )
      .andWhere('product.deletedAt IS NULL');

    if (name) {
      queryBuilder.andWhere(`LOWER(product.name) LIKE LOWER(:name)`, {
        name: `%${name}%`,
      });
    }
    if (category) {
      queryBuilder.andWhere(`LOWER(category.name) LIKE LOWER(:category)`, {
        category: `%${category}%`,
      });
    }

    queryBuilder.take(size).skip(offset);

    return queryBuilder.getManyAndCount();
  }

  deleteProduct(uuid: string) {
    return this.productRepository.softDelete({ uuid: uuid });
  }

  getProductsNotInBranch(branchId: string) {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect(
        'product.category',
        'category',
        'category.deletedAt IS NOT NULL OR category.deletedAt IS NULL',
      )
      .where('product.deletedAt IS NULL')
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('stock.uuid_product')
          .from('stock', 'stock')
          .where('stock.uuid_branch = :branchId')
          .andWhere('stock.deleted_at IS NULL')
          .getQuery();
        return `product.uuid NOT IN ${subQuery}`;
      })
      .setParameter('branchId', branchId)
      .getMany();
  }

  updateProduct(product: StockProduct) {
    return this.productRepository.save(product);
  }
}
