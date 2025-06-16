import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { DownloadReviewReportQuery } from './DownloadReviewReport.query';
import { BranchReviewService } from '../../services/BranchReview.service';
import { ReviewReportDto } from '../../dtos/ReviewReport.dto';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs/promises';
import { BranchService } from '../../services/Branch.service';


@QueryHandler(DownloadReviewReportQuery)
export class DownloadReviewReportQueryHandler implements IQueryHandler<DownloadReviewReportQuery> {
    constructor(
        private branchReviewService: BranchReviewService,
        private branchService: BranchService
    ) { }

    async execute(query: DownloadReviewReportQuery): Promise<WsResponse<string | Buffer>> {
        try {

            let reviews
            if (query.branchId) {

                const branch = await this.branchService.getBranchByUuid(query.branchId)
                if (!branch) return WsResponse.buildNotFoundResponse('BRANCH NOT FOUND');

                reviews = await this.branchReviewService.getBranchReviewsByRangeTime(
                    new Date(query.initialDate),
                    new Date(query.endDate),
                    branch.uuid
                );
            } else {
                reviews = await this.branchReviewService.getAllReviewsByRangeTime(
                    new Date(query.initialDate),
                    new Date(query.endDate),
                );;

            }


            if (reviews.length == 0) return WsResponse.buildNotFoundResponse('REVIEWS NOT FOUND');

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
