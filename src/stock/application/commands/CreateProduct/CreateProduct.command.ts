import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { ProductDto } from '../../dtos/Product.dto';
import { CreateProductRequestDto } from '../../dtos/CreateProductRequest.dto';


export class CreateProductCommand extends Command<WsResponse< ProductDto | string>> {
  constructor(public body: CreateProductRequestDto) {
    super();
  }
}
