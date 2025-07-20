import { Injectable } from '@nestjs/common';
import { StockProductRepository } from 'src/stock/infrastructure/repositories/StockProduct.repository';
import { CreateProductRequestDto } from '../dtos/CreateProductRequest.dto';
import { StockProduct } from 'src/stock/domain/entities/StockProduct.entity';


@Injectable()
export class ProductService {
    constructor(private readonly productRepository: StockProductRepository) { }

    creteProduct(request: CreateProductRequestDto) {
        return this.productRepository.save(
            this.productRepository.create({
                name: request.name,
                measurementUnit: request.measurementUnit,
                uuid_category: request.uuid_category
            })
        )
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
                'category.deletedAt IS NOT NULL OR category.deletedAt IS NULL'
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
                'category.deletedAt IS NOT NULL OR category.deletedAt IS NULL'
            )
            .andWhere('product.deletedAt IS NULL')
            .getMany();
    }

     getProductsPaginated(size: number, offset:number) {
        return this.productRepository
            .createQueryBuilder('product') 
            .leftJoinAndSelect(
                'product.category',
                'category', 
                'category.deletedAt IS NOT NULL OR category.deletedAt IS NULL'
            )
            .andWhere('product.deletedAt IS NULL')
            .take(size)
            .skip(offset)
            .getManyAndCount();
    }

    deleteProduct(uuid: string) {
        return this.productRepository.softDelete({ uuid: uuid });
    }

    updateProduct(product: StockProduct) {
        return this.productRepository.save(product);
    }

}
