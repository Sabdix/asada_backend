import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { BranchReviewService } from '../../services/BranchReview.service';
//import * as XLSX from 'xlsx';
import * as base64 from 'base64-node';
import { ReviewReportDto } from '../../dtos/ReviewReport.dto';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs/promises';
import { promises } from 'dns';
import { DownloadReviewReport64Query } from './DownloadReviewReport64.query';


@QueryHandler(DownloadReviewReport64Query)
export class DownloadReviewReport64QueryHandler implements IQueryHandler<DownloadReviewReport64Query> {
    constructor(
        private branchReviewService: BranchReviewService
    ) { }

    async execute(query: DownloadReviewReport64Query){
        const reviews = await this.branchReviewService.getAllReviewsByRangeTime(new Date(query.initialDate), new Date(query.endDate));
        const data: ReviewReportDto[] = [];
        for (const review of reviews) {
            const reviewReport = new ReviewReportDto();
            reviewReport.Nombre = review.name;
            reviewReport.Calificacion = review.rate;
            reviewReport.Comentario = review.comment;
            reviewReport.Sucursal = review.branch.name;
            reviewReport.Fecha = review.createdAt;
            data.push(reviewReport);
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte de Reseñas');

        worksheet.columns = [
            { header: 'Nombre', key: 'Nombre', width: 20 },
            { header: 'Calificación', key: 'Calificacion', width: 15 },
            { header: 'Comentario', key: 'Comentario', width: 30 },
            { header: 'Sucursal', key: 'Sucursal', width: 20 },
            { header: 'Fecha', key: 'Fecha', width: 20 },
        ];

        data.forEach(item => {
            worksheet.addRow(item);
        });

        const tempFilePath = 'temp_report.xlsx';
        await workbook.xlsx.writeFile(tempFilePath);
        const excelBuffer = await fs.readFile(tempFilePath);
        const buffer = await workbook.xlsx.writeBuffer();
        await fs.unlink(tempFilePath); // Limpiar el archivo temporal

        const base64String = base64.encode(excelBuffer);

        return WsResponse.buildOkResponse(base64String);
    }


}
