import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs/promises';
import { DownloadStockReportQuery } from './DownloadStockReport.query';
import { StockHistoryService } from '../../services/StockHistory.service';
import { BranchService } from 'src/branch/application/services/Branch.service';
import { StockHistoryReportDto } from '../../dtos/StockHistoryReportDto';
import { StockEntrancesService } from '../../services/StockEntrances.service';
import { StockHistoryType } from 'src/stock/domain/enums/StockHistoryType.enum';


@QueryHandler(DownloadStockReportQuery)
export class DownloadStockReportQueryHandler implements IQueryHandler<DownloadStockReportQuery> {
    constructor(
        private stockHistoryService: StockHistoryService,
        private branchService: BranchService,
        private stockEntranceService: StockEntrancesService
    ) { }

    async execute(query: DownloadStockReportQuery): Promise<WsResponse<string | Buffer>> {
    try {
        const branch = await this.branchService.getBranchByUuid(query.branchId);
        if (!branch) return WsResponse.buildNotFoundResponse('BRANCH NOT FOUND');

        const stockHistories = await this.stockHistoryService.getBranchStockHistoryByRangeTime(
            new Date(query.initialDate),
            new Date(query.endDate),
            branch.uuid
        );

        if (stockHistories.length === 0) return WsResponse.buildNotFoundResponse('STOCK_HISTORIES NOT FOUND');

        // ── 1. Agrupar por producto (ya vienen ordenados por createdAt ASC) ──
        const stockByProduct = new Map<string, typeof stockHistories>();
        for (const sh of stockHistories) {
            const key = sh.stock.product.name;
            if (!stockByProduct.has(key)) stockByProduct.set(key, []);
            stockByProduct.get(key)!.push(sh);
        }

        // ── 2. Helper: extraer turno del nombre del checklist ──
        const getTurno = (checklistName: string): 'matutino' | 'vespertino' | null => {
            const lower = checklistName.toLowerCase();
            if (lower.includes('matutino')) return 'matutino';
            if (lower.includes('vespertino')) return 'vespertino';
            return null;
        };

        // ── 3. Construir DTOs ──
        const data: StockHistoryReportDto[] = [];

        for (const stockHistory of stockHistories) {
            console.log(stockHistory);

            const stockHistoryReport = new StockHistoryReportDto();
            stockHistoryReport.CantidadActual = stockHistory.quantity.toString();
            stockHistoryReport.CantidadPrevia = stockHistory.previousQuantity.toString();
            stockHistoryReport.CantidadRequerida = stockHistory.stock.requiredStock.toString();
            stockHistoryReport.CantidadRequeridaFestivo = stockHistory.stock.holidayRequiredStock.toString();
            stockHistoryReport.Fecha = stockHistory.date.toString();
            stockHistoryReport.Producto = stockHistory.stock.product.name;
            stockHistoryReport.Revisor = `${stockHistory.user?.name} ${stockHistory.user?.last_name} ${stockHistory.user?.second_last_name}`;
            stockHistoryReport.UnidadMedida = stockHistory.stock.product.measurementUnit;
            stockHistoryReport.Tipo = stockHistory.type;
            stockHistoryReport.ASolicitar = stockHistory.stock.requiredStock - stockHistory.quantity;
            stockHistoryReport.ASolicitarFestivo = stockHistory.stock.holidayRequiredStock - stockHistory.quantity;
            stockHistoryReport.CheckList = stockHistory.checklist?.name ?? '';
            stockHistoryReport.Entradas = await this.stockEntranceService.getTodayEntrances(
                stockHistory.stock.branch.uuid,
                stockHistory.uuid_user,
                stockHistory.stock.uuid
            );

            // ── 4. Calcular Diferencia solo en Apertura vs Cierre previo del turno complementario ──
            let diferencia: number | string = '';

            if (
                stockHistory.type === StockHistoryType.APERTURA &&
                stockHistory.checklist?.name
            ) {
                const turnoActual = getTurno(stockHistory.checklist.name);
                const siblings = stockByProduct.get(stockHistory.stock.product.name)!;
                const currentIndex = siblings.indexOf(stockHistory);

                // Apertura Matutina  ← busca Cierre Vespertino (día anterior)
                // Apertura Vespertina ← busca Cierre Matutino  (mismo día)
                const turnoEsperado = turnoActual === 'matutino' ? 'vespertino' : 'matutino';

                for (let i = currentIndex - 1; i >= 0; i--) {
                    const candidate = siblings[i];
                    if (
                        candidate.type === StockHistoryType.CIERRE &&
                        candidate.checklist?.name &&
                        getTurno(candidate.checklist.name) === turnoEsperado
                    ) {
                        diferencia = Math.abs(
                            Number(candidate.quantity) - Number(stockHistory.quantity)
                        );
                        break;
                    }
                }
            }

            stockHistoryReport.Diferencia = diferencia.toString();
            data.push(stockHistoryReport);
        }

        // ── 5. Generar Excel ──
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte de Bodega');

        worksheet.columns = [
            { header: 'Fecha',                        key: 'Fecha',                   width: 15 },
            { header: 'Usuario capturo',              key: 'Revisor',                 width: 30 },
            { header: 'Producto',                     key: 'Producto',                width: 20 },
            { header: 'Stock Requerido',              key: 'CantidadRequerida',       width: 20 },
            { header: 'Stock Requerido (Festivo)',    key: 'CantidadRequeridaFestivo',width: 25 },
            { header: 'Cantidad Conteo Previo',       key: 'CantidadPrevia',          width: 15 },
            { header: 'Conteo en turno',              key: 'CantidadActual',          width: 15 },
            { header: 'Diferencia',                   key: 'Diferencia',              width: 15, style: { numFmt: '0.000' } },
            { header: 'A solicitar',                  key: 'ASolicitar',              width: 15, style: { numFmt: '0.000' } },
            { header: 'A solicitar Festivo',          key: 'ASolicitarFestivo',       width: 15, style: { numFmt: '0.000' } },
            { header: 'Entradas registradas en turno',key: 'Entradas',                width: 30 },
        ];

        data.forEach((item) => worksheet.addRow(item));

        const tempFilePath = 'temp_report.xlsx';
        await workbook.xlsx.writeFile(tempFilePath);
        const excelBuffer = await fs.readFile(tempFilePath);
        await fs.unlink(tempFilePath);

        return WsResponse.buildOkResponse(excelBuffer);

    } catch (error) {
        console.error('Error al generar el reporte de Excel:', error);
        return WsResponse.buildErrorResponse(1, 'Error al generar el reporte de Excel.', error);
    }
}
}
