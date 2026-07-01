import { Injectable } from '@nestjs/common';
import { StockRequestRepository } from 'src/stock/infrastructure/repositories/StockRequest.repository';
import { StockRequestDetailRepository } from 'src/stock/infrastructure/repositories/StockRequestDetail.repository';
import { StockRequest } from 'src/stock/domain/entities/StockRequest.entity';
import { StockRequestDetail } from 'src/stock/domain/entities/StockRequestDetail.entity';
import { StockClosingReportItemDto } from '../dtos/SendStockClosingReportRequest.dto';

@Injectable()
export class StockRequestService {
  constructor(
    private readonly stockRequestRepository: StockRequestRepository,
    private readonly stockRequestDetailRepository: StockRequestDetailRepository,
  ) {}

  async createRequest(
    to: string,
    cc: string,
    subject: string,
    method: string,
    branchId: string | null,
    data: StockClosingReportItemDto[],
  ): Promise<StockRequest> {
    const stockRequest = this.stockRequestRepository.create({
      date: new Date(),
      recipient_email: to,
      cc: cc || null,
      subject: subject || 'Reporte Cierre Vespertino - Bodega',
      uuid_branch: branchId || null,
      method,
      status: 'sent',
    } as Partial<StockRequest>);

    const savedRequest = await this.stockRequestRepository.save(stockRequest);

    const details = data.map((item) =>
      this.stockRequestDetailRepository.create({
        uuid_stock_request: savedRequest.uuid,
        producto: item.Producto,
        unidad_medida: item.UnidadMedida,
        cantidad_requerida: item.CantidadRequerida,
        cantidad_requerida_festivo: item.CantidadRequeridaFestivo,
        fecha: item.Fecha,
        cantidad_actual: item.CantidadActual,
        cantidad_previa: item.CantidadPrevia,
        a_solicitar: item.ASolicitar,
        a_solicitar_festivo: item.ASolicitarFestivo,
        revisor: item.Revisor,
        tipo: item.Tipo,
        checklist: item.CheckList,
        entradas: item.Entradas,
        diferencia: item.Diferencia,
        turno: item.Turno,
      } as Partial<StockRequestDetail>),
    );

    await this.stockRequestDetailRepository.save(details);

    return savedRequest;
  }

  async getAll(): Promise<StockRequest[]> {
    return this.stockRequestRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getAllPaginated(
    size: number,
    offset: number,
  ): Promise<[StockRequest[], number]> {
    return this.stockRequestRepository.findAndCount({
      order: { createdAt: 'DESC' },
      take: size || 10,
      skip: offset || 0,
    });
  }

  async getDetailByRequestUuid(uuid: string) {
    return this.stockRequestDetailRepository.find({
      where: { uuid_stock_request: uuid },
      order: { createdAt: 'ASC' },
    });
  }
}
