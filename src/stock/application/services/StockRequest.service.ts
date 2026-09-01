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
    status: string = 'sent',
  ): Promise<StockRequest> {
    const stockRequest = this.stockRequestRepository.create({
      date: new Date(),
      recipient_email: to,
      cc: cc || null,
      subject: subject || null,
      uuid_branch: branchId || null,
      method,
      status,
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
        a_solicitar: Math.round(Number(item.ASolicitar) * 100) / 100,
        a_solicitar_festivo:
          Math.round(Number(item.ASolicitarFestivo) * 100) / 100,
        revisor: item.Revisor,
        tipo: item.Tipo,
        checklist: item.CheckList,
        entradas: Math.round(Number(item.Entradas) * 100) / 100,
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
    branchId?: string,
  ): Promise<[StockRequest[], number]> {
    const queryBuilder = this.stockRequestRepository
      .createQueryBuilder('sr')
      .leftJoinAndSelect('branch', 'b', 'b.uuid = sr.uuid_branch')
      .where('sr.deletedAt IS NULL')
      .orderBy('sr.createdAt', 'DESC')
      .take(size || 10)
      .skip(offset || 0);

    if (branchId) {
      queryBuilder.andWhere('sr.uuid_branch = :branchId', { branchId });
    }

    const total = await queryBuilder.getCount();
    const raw = await queryBuilder.getRawAndEntities();

    const requests = raw.entities.map((entity, index) => {
      entity.branchName = raw.raw[index]?.b_name ?? null;
      return entity;
    });

    return [requests, total];
  }

  async getDetailByRequestUuid(uuid: string) {
    return this.stockRequestDetailRepository.find({
      where: { uuid_stock_request: uuid },
      order: { createdAt: 'ASC' },
    });
  }

  async updateRequest(
    uuid: string,
    data: StockClosingReportItemDto[],
    branchId?: string,
  ): Promise<StockRequest | null> {
    const request = await this.stockRequestRepository.findOneBy({ uuid });
    if (!request) return null;

    if (branchId !== undefined) {
      request.uuid_branch = branchId || '';
    }

    await this.stockRequestRepository.save(request);

    // Remove old details and insert new ones
    await this.stockRequestDetailRepository.softDelete({
      uuid_stock_request: uuid,
    });

    const details = data.map((item) =>
      this.stockRequestDetailRepository.create({
        uuid_stock_request: uuid,
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

    return request;
  }

  async updateStatus(uuid: string, status: string): Promise<void> {
    await this.stockRequestRepository.update({ uuid }, { status });
  }

  async deleteRequest(uuid: string): Promise<boolean> {
    await this.stockRequestDetailRepository.softDelete({
      uuid_stock_request: uuid,
    });
    const result = await this.stockRequestRepository.softDelete({ uuid });
    return (result.affected ?? 0) > 0;
  }
}
