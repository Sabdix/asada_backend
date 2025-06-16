import { Injectable } from '@nestjs/common';
import { ProductCategoryRepository } from 'src/stock/infrastructure/repositories/ProductCategory.repository';
import { CreateProductCategoryRequestDto } from '../dtos/CreateProductCategory.dto';
import { ProductCategory } from 'src/stock/domain/entities/ProductCategory.entity';


@Injectable()
export class ProductCategoryService {
    constructor(private readonly productCategoryRepository: ProductCategoryRepository) { }

    creteProductCategory(request: CreateProductCategoryRequestDto) {
        return this.productCategoryRepository.save(
            this.productCategoryRepository.create({
                name: request.name
            })
        )
    }

    getProductCategoryByName(name: string) {
        return this.productCategoryRepository.findOneBy({ name: name });
    }

    getProductCategoryByUuid(uuid: string) {
        return this.productCategoryRepository.findOneBy({ uuid: uuid });
    }

    getProductCategories() {
        return this.productCategoryRepository.find();
    }

    deleteProductCategory(uuid: string) {
        return this.productCategoryRepository.softDelete({ uuid: uuid });
    }

    updateProductCategory(productCategory: ProductCategory) {
        return this.productCategoryRepository.save(productCategory);
    }

}
