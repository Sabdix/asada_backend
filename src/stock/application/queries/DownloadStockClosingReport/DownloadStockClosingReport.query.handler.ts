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

@QueryHandler(DownloadStockClosingReportQuery)
export class DownloadStockClosingReportQueryHandler
  implements IQueryHandler<DownloadStockClosingReportQuery>
{
  constructor(
    private stockHistoryService: StockHistoryService,
    private branchService: BranchService,
    private stockEntranceService: StockEntrancesService,
  ) {}

  async execute(
    query: DownloadStockClosingReportQuery,
  ): Promise<WsResponse<Buffer | StockHistoryReportDto[] | string>> {
    try {
      const branch = await this.branchService.getBranchByUuid(query.branchId);
      if (!branch) return WsResponse.buildNotFoundResponse('BRANCH NOT FOUND');

      // Usar la misma fecha como inicio y fin del día
      const date = new Date(query.date);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const stockHistories =
        await this.stockHistoryService.getBranchStockHistoryByRangeTime(
          startOfDay,
          endOfDay,
          branch.uuid,
        );

      if (stockHistories.length === 0)
        return WsResponse.buildNotFoundResponse('STOCK_HISTORIES NOT FOUND');

      // Filtrar solo registros de cierre vespertino
      const cierreVespertino = stockHistories.filter((sh) => {
        if (sh.type !== StockHistoryType.CIERRE) return false;
        const checklistName = sh.checklist?.name?.toLowerCase() ?? '';
        return checklistName.includes('vespertino');
      });

      if (cierreVespertino.length === 0)
        return WsResponse.buildNotFoundResponse(
          'NO CLOSING VESPERTINO RECORDS FOUND',
        );

      // Agrupar por producto para cálculo de diferencia
      const stockByProduct = new Map<string, typeof stockHistories>();
      for (const sh of stockHistories) {
        const key = sh.stock.product.name;
        if (!stockByProduct.has(key)) stockByProduct.set(key, []);
        stockByProduct.get(key)!.push(sh);
      }

      // Helper: extraer turno del nombre del checklist
      const getTurno = (
        checklistName: string,
      ): 'matutino' | 'vespertino' | null => {
        const lower = checklistName.toLowerCase();
        if (lower.includes('matutino')) return 'matutino';
        if (lower.includes('vespertino')) return 'vespertino';
        return null;
      };

      // Construir DTOs solo para cierre vespertino
      const data: StockHistoryReportDto[] = [];

      for (const stockHistory of cierreVespertino) {
        const stockHistoryReport = new StockHistoryReportDto();
        stockHistoryReport.CantidadActual = stockHistory.quantity.toString();
        stockHistoryReport.CantidadPrevia =
          stockHistory.previousQuantity.toString();
        stockHistoryReport.CantidadRequerida =
          stockHistory.stock.requiredStock.toString();
        stockHistoryReport.CantidadRequeridaFestivo =
          stockHistory.stock.holidayRequiredStock.toString();
        stockHistoryReport.Fecha = stockHistory.date.toString();
        stockHistoryReport.Producto = stockHistory.stock.product.name;
        stockHistoryReport.Revisor = `${stockHistory.user?.name} ${stockHistory.user?.last_name} ${stockHistory.user?.second_last_name}`;
        stockHistoryReport.UnidadMedida =
          stockHistory.stock.product.measurementUnit;
        stockHistoryReport.Tipo = stockHistory.type;
        stockHistoryReport.ASolicitar =
          stockHistory.stock.requiredStock - stockHistory.quantity;
        stockHistoryReport.ASolicitarFestivo =
          stockHistory.stock.holidayRequiredStock - stockHistory.quantity;
        stockHistoryReport.CheckList = stockHistory.checklist?.name ?? '';
        stockHistoryReport.Entradas =
          await this.stockEntranceService.getTodayEntrances(
            stockHistory.stock.branch.uuid,
            stockHistory.uuid_user,
            stockHistory.stock.uuid,
          );

        // Calcular Diferencia: busca apertura vespertina previa del mismo producto
        let diferencia: number | string = '';
        const siblings = stockByProduct.get(stockHistory.stock.product.name)!;
        const currentIndex = siblings.indexOf(stockHistory);

        for (let i = currentIndex - 1; i >= 0; i--) {
          const candidate = siblings[i];
          if (
            candidate.type === StockHistoryType.APERTURA &&
            candidate.checklist?.name &&
            getTurno(candidate.checklist.name) === 'vespertino'
          ) {
            diferencia = Math.abs(
              Number(candidate.quantity) - Number(stockHistory.quantity),
            );
            break;
          }
        }

        stockHistoryReport.Diferencia = diferencia.toString();
        stockHistoryReport.Turno = 'Cierre Vespertino';

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
        {
          header: 'Stock Requerido (Festivo)',
          key: 'CantidadRequeridaFestivo',
          width: 25,
        },
        { header: 'Cantidad Conteo Previo', key: 'CantidadPrevia', width: 15 },
        { header: 'Conteo en turno', key: 'CantidadActual', width: 15 },
        { header: 'Turno', key: 'Turno', width: 25 },
        {
          header: 'Diferencia',
          key: 'Diferencia',
          width: 15,
          style: { numFmt: '0.000' },
        },
        {
          header: 'A solicitar',
          key: 'ASolicitar',
          width: 15,
          style: { numFmt: '0.000' },
        },
        {
          header: 'A solicitar Festivo',
          key: 'ASolicitarFestivo',
          width: 15,
          style: { numFmt: '0.000' },
        },
        {
          header: 'Entradas registradas en turno',
          key: 'Entradas',
          width: 30,
        },
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
