import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs/promises';
import { DownloadStockClosingReportQuery } from './DownloadStockClosingReport.query';
import { StockHistoryService } from '../../services/StockHistory.service';
import { BranchService } from 'src/branch/application/services/Branch.service';
import { StockHistoryReportDto } from '../../dtos/StockHistoryReportDto';
import { StockEntrancesService } from '../../services/StockEntrances.service';
import { StockHistoryType } from 'src/stock/domain/enums/StockHistoryType.enum';
import { StockService } from '../../services/Stock.service';

@QueryHandler(DownloadStockClosingReportQuery)
export class DownloadStockClosingReportQueryHandler
  implements IQueryHandler<DownloadStockClosingReportQuery>
{
  constructor(
    private stockHistoryService: StockHistoryService,
    private branchService: BranchService,
    private stockEntranceService: StockEntrancesService,
    private stockService: StockService,
  ) {}

  async execute(
    query: DownloadStockClosingReportQuery,
  ): Promise<WsResponse<Buffer | StockHistoryReportDto[] | string>> {
    try {
      const branch = await this.branchService.getBranchByUuid(query.branchId);
      if (!branch) return WsResponse.buildNotFoundResponse('BRANCH NOT FOUND');

      const date = new Date(query.date);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Obtener todos los stocks de la branch (todos los productos configurados)
      const allStocks = await this.stockService.getStockByBranch(branch.uuid);
      if (allStocks.length === 0)
        return WsResponse.buildNotFoundResponse('NO STOCKS FOUND FOR BRANCH');

      // Obtener historial del día
      const stockHistories =
        await this.stockHistoryService.getBranchStockHistoryByRangeTime(
          startOfDay,
          endOfDay,
          branch.uuid,
        );

      // Indexar cierres vespertinos por uuid_stock
      const cierresVespertinos = new Map<string, typeof stockHistories[number]>();
      for (const sh of stockHistories) {
        if (sh.type !== StockHistoryType.CIERRE) continue;
        const checklistName = sh.checklist?.name?.toLowerCase() ?? '';
        if (checklistName.includes('vespertino')) {
          cierresVespertinos.set(sh.stock.uuid, sh);
        }
      }

      // Construir DTOs para todos los productos
      const data: StockHistoryReportDto[] = [];

      for (const stock of allStocks) {
        const stockHistoryReport = new StockHistoryReportDto();
        const cierreVespertino = cierresVespertinos.get(stock.uuid);
        const tieneCierreVespertino = !!cierreVespertino;

        stockHistoryReport.UuidProducto = stock.product.uuid;
        stockHistoryReport.Producto = stock.product.name;
        stockHistoryReport.UnidadMedida = stock.product.measurementUnit;
        stockHistoryReport.CantidadRequerida = stock.requiredStock.toString();
        stockHistoryReport.CantidadRequeridaFestivo = stock.holidayRequiredStock.toString();
        stockHistoryReport.Fecha = date.toISOString().split('T')[0];
        stockHistoryReport.CierreVespertino = tieneCierreVespertino;

        if (tieneCierreVespertino) {
          stockHistoryReport.CantidadActual = cierreVespertino.quantity.toString();
          stockHistoryReport.CantidadPrevia = cierreVespertino.previousQuantity.toString();
          stockHistoryReport.Revisor = `${cierreVespertino.user?.name ?? ''} ${cierreVespertino.user?.last_name ?? ''} ${cierreVespertino.user?.second_last_name ?? ''}`.trim();
          stockHistoryReport.Tipo = cierreVespertino.type;
          stockHistoryReport.CheckList = cierreVespertino.checklist?.name ?? '';
          stockHistoryReport.ASolicitar = stock.requiredStock - cierreVespertino.quantity;
          stockHistoryReport.ASolicitarFestivo = stock.holidayRequiredStock - cierreVespertino.quantity;
          stockHistoryReport.Entradas = await this.stockEntranceService.getTodayEntrances(
            branch.uuid,
            cierreVespertino.uuid_user,
            stock.uuid,
          );

          // Calcular diferencia: apertura vespertina vs cierre vespertino
          let diferencia: number | string = '';
          const siblings = stockHistories.filter(
            (sh) => sh.stock.uuid === stock.uuid,
          );
          for (let i = siblings.length - 1; i >= 0; i--) {
            const candidate = siblings[i];
            if (
              candidate.type === StockHistoryType.APERTURA &&
              candidate.checklist?.name?.toLowerCase().includes('vespertino')
            ) {
              diferencia = Math.abs(
                Number(candidate.quantity) - Number(cierreVespertino.quantity),
              );
              break;
            }
          }
          stockHistoryReport.Diferencia = diferencia.toString();
          stockHistoryReport.Turno = 'Cierre Vespertino';
        } else {
          stockHistoryReport.CantidadActual = '';
          stockHistoryReport.CantidadPrevia = '';
          stockHistoryReport.Revisor = '';
          stockHistoryReport.Tipo = '';
          stockHistoryReport.CheckList = '';
          stockHistoryReport.ASolicitar = 0;
          stockHistoryReport.ASolicitarFestivo = 0;
          stockHistoryReport.Entradas = 0;
          stockHistoryReport.Diferencia = '';
          stockHistoryReport.Turno = '';
        }

        data.push(stockHistoryReport);
      }

      // Responder según formato solicitado
      if (query.format === 'JSON') {
        return WsResponse.buildOkResponse(data);
      }

      // Generar Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Cierre Vespertino');

      worksheet.columns = [
        { header: 'Fecha', key: 'Fecha', width: 15 },
        { header: 'Usuario capturo', key: 'Revisor', width: 30 },
        { header: 'Producto', key: 'Producto', width: 20 },
        { header: 'Stock Requerido', key: 'CantidadRequerida', width: 20 },
        { header: 'Stock Requerido (Festivo)', key: 'CantidadRequeridaFestivo', width: 25 },
        { header: 'Cantidad Conteo Previo', key: 'CantidadPrevia', width: 15 },
        { header: 'Conteo en turno', key: 'CantidadActual', width: 15 },
        { header: 'Turno', key: 'Turno', width: 25 },
        { header: 'Cierre Vespertino', key: 'CierreVespertino', width: 18 },
        { header: 'Diferencia', key: 'Diferencia', width: 15, style: { numFmt: '0.000' } },
        { header: 'A solicitar', key: 'ASolicitar', width: 15, style: { numFmt: '0.000' } },
        { header: 'A solicitar Festivo', key: 'ASolicitarFestivo', width: 15, style: { numFmt: '0.000' } },
        { header: 'Entradas registradas en turno', key: 'Entradas', width: 30 },
      ];

      data.forEach((item) => worksheet.addRow(item));

      const tempFilePath = 'temp_closing_report.xlsx';
      await workbook.xlsx.writeFile(tempFilePath);
      const excelBuffer = await fs.readFile(tempFilePath);
      await fs.unlink(tempFilePath);

      return WsResponse.buildOkResponse(excelBuffer);
    } catch (error) {
      console.error('Error al generar el reporte de cierre vespertino:', error);
      return WsResponse.buildErrorResponse(
        1,
        'Error al generar el reporte de cierre vespertino.',
        error,
      );
    }
  }
}
