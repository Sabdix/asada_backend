import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { ProductCategoryDto } from '../../dtos/ProductCategory.dto';
import { UpdateProductCategoryRequestDto } from '../../dtos/UpdateProductCategoryRequest.dto';


export class UpdateProductCategoryCommand extends Command<WsResponse<ProductCategoryDto | string>> {
  constructor(public body: UpdateProductCategoryRequestDto, public uuid: string
  ) {
    super();
  }
}
