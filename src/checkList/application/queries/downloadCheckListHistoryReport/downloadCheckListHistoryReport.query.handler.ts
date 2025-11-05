import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs/promises';
import { DownloadCheckListHistoryReportQuery } from './downloadCheckListHistoryReport.query';
import { CheckListHistoryService } from '../../services/checkListHistory.service';
import { CheckListHistoryReportDto } from '../../dtos/CheckListHistoryReport.dto';
import { BranchService } from 'src/branch/application/services/Branch.service';
import { UserService } from 'src/user/application/services/user.service';


@QueryHandler(DownloadCheckListHistoryReportQuery)
export class DownloadCheckListHistoryReportQueryHandler implements IQueryHandler<DownloadCheckListHistoryReportQuery> {
    constructor(
        private checkListHistoryService: CheckListHistoryService,
        private branchService: BranchService,
        private userService: UserService
    ) { }

    async execute(query: DownloadCheckListHistoryReportQuery): Promise<WsResponse<string | Buffer>> {
        try {

            let histories
            if (query.branchId) {

                const branch = await this.branchService.getBranchByUuid(query.branchId)
                if (!branch) return WsResponse.buildNotFoundResponse('BRANCH NOT FOUND');

                histories = await this.checkListHistoryService.getBranchCheckListHistoryByRangeTime(
                    new Date(query.initialDate),
                    new Date(query.endDate),
                    branch.uuid
                );
            } else {
                histories = await this.checkListHistoryService.getCheckListHistoryByRangeTime(
                    new Date(query.initialDate),
                    new Date(query.endDate),
                );

            }
            if (histories.length == 0) return WsResponse.buildNotFoundResponse('REVIEWS NOT FOUND');

            const data: CheckListHistoryReportDto[] = [];

            for (const history of histories) {

                const historyReport = new CheckListHistoryReportDto();
                historyReport.Lista = history.check_list_user.checkList.name;
                const user = await this.userService.getUserByUuid(history.uuid_user)
                historyReport.Empleado = user?.name + " " + user?.last_name + " " + user?.second_last_name;
                historyReport.Sucursal = user?.branch?.name ? user?.branch.name : "";
                let dayName = "";
                switch (history.check_list_user.weekDay) {
                    case 0:
                        dayName = 'Domingo';
                        break;
                    case 1:
                        dayName = 'Lunes';
                        break;
                    case 2:
                        dayName = 'Martes';
                        break;
                    case 3:
                        dayName = 'Miércoles';
                        break;
                    case 4:
                        dayName = 'Jueves';
                        break;
                    case 5:
                        dayName = 'Viernes';
                        break;
                    case 6:
                        dayName = 'Sábado';
                        break;
                    default:
                        dayName = 'Día Inválido';
                        break;
                }
                historyReport.Dia = dayName;
                historyReport.HoraInicio = history.check_list_user.initHour;
                historyReport.HoraFin = history.check_list_user.endHour;
                historyReport.Fecha = history.date.toString();
                historyReport.Estado = history.status ? "Realizada" : "Sin Realizar"
                historyReport.Evaluador = user?.manager?.name + " " + user?.manager?.last_name + " " + user?.manager?.second_last_name;
                historyReport.Evaluacion = history.approved ? "Aprobada" : "No Aprobada"
                historyReport.Comentarios = history.comment
                historyReport.EvaluacionGerente = history.managerApproved ? "Aprobada" : "No Aprobada"
                historyReport.ComentariosGerente = history.managerComment

                data.push(historyReport);
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Reporte de Reseñas');

            worksheet.columns = [
                { header: 'Lista', key: 'Lista', width: 30 },
                { header: 'Empleado', key: 'Empleado', width: 30 },
                { header: 'Sucursal', key: 'Sucursal', width: 20 },
                { header: 'Dia', key: 'Dia', width: 10 },
                { header: 'HoraInicio', key: 'HoraInicio', width: 10 },
                { header: 'HoraFin', key: 'HoraFin', width: 10 },
                { header: 'Fecha', key: 'Fecha', width: 15 },
                { header: 'Estado', key: 'Estado', width: 10 },
                { header: 'Evaluador', key: 'Evaluador', width: 30 },
                { header: 'Evaluacion', key: 'Evaluacion', width: 15 },
                { header: 'Comentarios', key: 'Comentarios', width: 50 },
                { header: 'EvaluacionGerente', key: 'EvaluacionGerente', width: 15 },
                { header: 'ComentariosGerente', key: 'ComentariosGerente', width: 50 },
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
