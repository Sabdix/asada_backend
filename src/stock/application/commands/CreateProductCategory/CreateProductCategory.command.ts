import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CreateProductCategoryRequestDto } from '../../dtos/CreateProductCategory.dto';
import { ProductCategoryDto } from '../../dtos/ProductCategory.dto';


export class CreateProductCategoryCommand extends Command<WsResponse< ProductCategoryDto | string>> {
  constructor(public body: CreateProductCategoryRequestDto) {
    super();
  }
}
