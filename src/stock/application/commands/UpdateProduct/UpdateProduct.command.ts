import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { ProductDto } from '../../dtos/Product.dto';
import { UpdateProductRequestDto } from '../../dtos/UpdateProductRequest.dto';


export class UpdateProductCommand extends Command<WsResponse<ProductDto | string>> {
  constructor(public body: UpdateProductRequestDto, public uuid: string
  ) {
    super();
  }
}
