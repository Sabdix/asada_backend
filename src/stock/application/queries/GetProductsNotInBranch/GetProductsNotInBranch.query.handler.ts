import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductsNotInBranchQuery } from './GetProductsNotInBranch.query';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { StockHistoryReportDto } from '../../dtos/StockHistoryReportDto';
import { ProductService } from '../../services/Product.service';

@QueryHandler(GetProductsNotInBranchQuery)
export class GetProductsNotInBranchQueryHandler
  implements IQueryHandler<GetProductsNotInBranchQuery>
{
  constructor(private readonly productService: ProductService) {}

  async execute(
    query: GetProductsNotInBranchQuery,
  ): Promise<WsResponse<StockHistoryReportDto[]>> {
    const products = await this.productService.getProductsNotInBranch(
      query.branchId,
    );

    const data: StockHistoryReportDto[] = products.map((product) => {
      const dto = new StockHistoryReportDto();
      dto.UuidProducto = product.uuid;
      dto.Producto = product.name;
      dto.UnidadMedida = product.measurementUnit || '';
      dto.CantidadRequerida = '0';
      dto.CantidadRequeridaFestivo = '0';
      dto.Fecha = '';
      dto.CantidadActual = '0';
      dto.CantidadPrevia = '0';
      dto.ASolicitar = 0;
      dto.ASolicitarFestivo = 0;
      dto.Revisor = '';
      dto.Tipo = '';
      dto.CheckList = '';
      dto.Entradas = 0;
      dto.Diferencia = '';
      dto.Turno = '';
      return dto;
    });

    return WsResponse.buildOkResponse(data);
  }
}
