import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs/promises';
import { DownloadStockReportQuery } from './DownloadStockReport.query';
import { StockHistoryService } from '../../services/StockHistory.service';
import { BranchService } from 'src/branch/application/services/Branch.service';
import { StockHistoryReportDto } from '../../dtos/StockHistoryReportDto';


@QueryHandler(DownloadStockReportQuery)
export class DownloadStockReportQueryHandler implements IQueryHandler<DownloadStockReportQuery> {
    constructor(
        private stockHistoryService: StockHistoryService,
        private branchService: BranchService
    ) { }

    async execute(query: DownloadStockReportQuery): Promise<WsResponse<string | Buffer>> {
        try {



            const branch = await this.branchService.getBranchByUuid(query.branchId)
            if (!branch) return WsResponse.buildNotFoundResponse('BRANCH NOT FOUND');

            const stockHistories = await this.stockHistoryService.getBranchStockHistoryByRangeTime(
                new Date(query.initialDate),
                new Date(query.endDate),
                branch.uuid
            );

            if (stockHistories.length == 0) return WsResponse.buildNotFoundResponse('STOCK_HISTORIES NOT FOUND');

            const data: StockHistoryReportDto[] = [];

            for (const stockHistory of stockHistories) {

                const stockHistoryReport = new StockHistoryReportDto();
                stockHistoryReport.CantidadActual = stockHistory.quantity.toString();
                stockHistoryReport.CantidadPrevia = stockHistory.previousQuantity.toString();
                stockHistoryReport.CantidadRequerida = stockHistory.stock.requiredStock.toString();
                stockHistoryReport.CantidadRequeridaFestivo = stockHistory.stock.holidayRequiredStock.toString();
                stockHistoryReport.Fecha = stockHistory.date.toString();
                stockHistoryReport.Producto = stockHistory.stock.product.name;
                stockHistoryReport.Revisor = stockHistory.user?.name + " " + stockHistory.user?.last_name + " " + stockHistory.user?.second_last_name;
                stockHistoryReport.UnidadMedida = stockHistory.stock.product.measurementUnit;
                stockHistoryReport.Tipo = stockHistory.type;
                stockHistoryReport.ASolicitar = stockHistory.type == "cierre" ? (stockHistory.stock.requiredStock - stockHistory.quantity).toString() : "0";
                stockHistoryReport.ASolicitarFestivo = stockHistory.type == "cierre" ? (stockHistory.stock.holidayRequiredStock - stockHistory.quantity).toString() : "0";

                data.push(stockHistoryReport);
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Reporte de Bodega');

            worksheet.columns = [
                { header: 'Producto', key: 'Producto', width: 20 },
                { header: 'Unidad de Medida', key: 'UnidadMedica', width: 18 },
                { header: 'Cantidad Requerida', key: 'CantidadRequerida', width: 20 },
                { header: 'Cantidad Requerida Festivo', key: 'CantidadRequeridaFestivo', width: 25 },
                { header: 'Cantidad Actual', key: 'CantidadActual', width: 15 },
                { header: 'Cantidad Previa', key: 'CantidadPrevia', width: 15 },
                { header: '"A solicitar', key: 'ASolicitar', width: 15 },
                { header: '"A solicitar Festivo', key: 'ASolicitarFestivo', width: 15 },
                { header: 'Fecha', key: 'Fecha', width: 15 },
                { header: 'Revisor', key: 'Revisor', width: 30 },
                { header: 'Tipo', key: 'Tipo', width: 15 }
            ];

            data.forEach((item) => {
                worksheet.addRow(item);
            });

            const tempFilePath = 'temp_report.xlsx';
            await workbook.xlsx.writeFile(tempFilePath);
            const excelBuffer = await fs.readFile(tempFilePath);
            await fs.unlink(tempFilePath);

            return WsResponse.buildOkResponse(excelBuffer); // Devuelve el Buffer
        } catch (error) {
            console.error('Error al generar el reporte de Excel:', error);
            return WsResponse.buildErrorResponse(1, 'Error al generar el reporte de Excel.', error); // Manejo de error
        }
    }
}
