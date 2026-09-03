import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs/promises';
import { GetCheckListAnswersByBranchDateAndCheckListQuery } from './getCheckListAnswersByBranchDateAndCheckList.query';
import { CheckListUserAnswersService } from '../../services/checkListUserAnswers.service';
import { BranchService } from 'src/branch/application/services/Branch.service';
import { CheckListService } from '../../services/checkList.service';

@QueryHandler(GetCheckListAnswersByBranchDateAndCheckListQuery)
export class GetCheckListAnswersByBranchDateAndCheckListQueryHandler
  implements IQueryHandler<GetCheckListAnswersByBranchDateAndCheckListQuery>
{
  constructor(
    private readonly checkListUserAnswersService: CheckListUserAnswersService,
    private readonly branchService: BranchService,
    private readonly checkListService: CheckListService,
  ) {}

  async execute(
    query: GetCheckListAnswersByBranchDateAndCheckListQuery,
  ): Promise<WsResponse<Buffer | string>> {
    try {
      const branch = await this.branchService.getBranchByUuid(query.uuidBranch);
      if (!branch) return WsResponse.buildNotFoundResponse('BRANCH NOT FOUND');

      const checkList = await this.checkListService.getCheckListByUuid(
        query.uuidCheckList,
      );
      if (!checkList)
        return WsResponse.buildNotFoundResponse('CHECKLIST NOT FOUND');

      const checkListAnswers =
        await this.checkListUserAnswersService.getCheckListUserAnswersByBranchDateAndCheckList(
          query.uuidBranch,
          query.date,
          query.uuidCheckList,
        );

      if (checkListAnswers.length === 0) {
        return WsResponse.buildNotFoundResponse('ANSWERS NOT FOUND');
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Respuestas Checklist');

      worksheet.columns = [
        { header: 'Usuario', key: 'Usuario', width: 30 },
        { header: 'Fecha', key: 'Fecha', width: 15 },
        { header: 'Sección', key: 'Seccion', width: 25 },
        { header: 'Pregunta', key: 'Pregunta', width: 40 },
        { header: 'Respuesta', key: 'Respuesta', width: 20 },
        { header: 'Observación', key: 'Observacion', width: 35 },
        { header: 'Estatus', key: 'Estatus', width: 15 },
        {
          header: 'Revisado por encargado',
          key: 'RevisadoEncargado',
          width: 25,
        },
        {
          header: 'Comentario encargado',
          key: 'ComentarioEncargado',
          width: 35,
        },
        {
          header: 'Aprobado por encargado',
          key: 'AprobadoEncargado',
          width: 25,
        },
        {
          header: 'Revisado por gerente',
          key: 'RevisadoGerente',
          width: 25,
        },
        {
          header: 'Comentario gerente',
          key: 'ComentarioGerente',
          width: 35,
        },
        {
          header: 'Aprobado por gerente',
          key: 'AprobadoGerente',
          width: 25,
        },
      ];

      for (const userAnswer of checkListAnswers) {
        const history = userAnswer.check_list_history;
        const user = history?.user;
        const criteriaAnswer = userAnswer.check_list_criteria_answer;
        const criteria = criteriaAnswer?.checkListItemCriteria;
        const item = criteria?.checkListItem;

        const userName = user
          ? `${user.name ?? ''} ${user.last_name ?? ''} ${user.second_last_name ?? ''}`.trim()
          : '';

        worksheet.addRow({
          Usuario: userName,
          Fecha: history?.date ? history.date.toString() : '',
          Seccion: item?.name ?? '',
          Pregunta: criteria?.text ?? '',
          Respuesta: criteriaAnswer?.text ?? '',
          Observacion: userAnswer.comment ?? '',
          Estatus: history?.status ? 'Realizada' : 'Sin Realizar',
          RevisadoEncargado: history?.revised ? 'Sí' : 'No',
          ComentarioEncargado: history?.comment ?? '',
          AprobadoEncargado: history?.approved ? 'Aprobado' : 'No Aprobado',
          RevisadoGerente: history?.managerRevised ? 'Sí' : 'No',
          ComentarioGerente: history?.managerComment ?? '',
          AprobadoGerente: history?.managerApproved ? 'Aprobado' : 'No Aprobado',
        });
      }

      const tempFilePath = `temp_checklist_answers_${Date.now()}.xlsx`;
      await workbook.xlsx.writeFile(tempFilePath);
      const excelBuffer = await fs.readFile(tempFilePath);
      await fs.unlink(tempFilePath);

      return WsResponse.buildOkResponse(excelBuffer);
    } catch (error) {
      console.error('Error al generar el reporte de Excel:', error);
      return WsResponse.buildErrorResponse(
        1,
        'Error al generar el reporte de Excel.',
        error,
      );
    }
  }
}
