import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { SendStockClosingReportCommand } from './SendStockClosingReport.command';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { SendMethod } from '../../dtos/SendStockClosingReportRequest.dto';
import mailjet from 'src/notification/infrastructure/config/mailjet.config';

@CommandHandler(SendStockClosingReportCommand)
export class SendStockClosingReportCommandHandler
  implements ICommandHandler<SendStockClosingReportCommand>
{
  private readonly logger = new Logger(SendStockClosingReportCommandHandler.name);

  async execute(command: SendStockClosingReportCommand): Promise<WsResponse<string>> {
    const { method, to, cc, subject, data } = command.data;

    if (method === SendMethod.WHATSAPP) {
      return WsResponse.buildBadRequestResponse('WHATSAPP not implemented yet');
    }

    try {
      // Build Excel in memory
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Cierre Vespertino');

      worksheet.columns = [
        { header: 'Fecha', key: 'Fecha', width: 15 },
        { header: 'Usuario capturo', key: 'Revisor', width: 30 },
        { header: 'Producto', key: 'Producto', width: 20 },
        { header: 'Unidad Medida', key: 'UnidadMedida', width: 15 },
        { header: 'Stock Requerido', key: 'CantidadRequerida', width: 20 },
        { header: 'Stock Requerido (Festivo)', key: 'CantidadRequeridaFestivo', width: 25 },
        { header: 'Cantidad Conteo Previo', key: 'CantidadPrevia', width: 15 },
        { header: 'Conteo en turno', key: 'CantidadActual', width: 15 },
        { header: 'Turno', key: 'Turno', width: 25 },
        { header: 'Diferencia', key: 'Diferencia', width: 15, style: { numFmt: '0.000' } },
        { header: 'A solicitar', key: 'ASolicitar', width: 15, style: { numFmt: '0.000' } },
        { header: 'A solicitar Festivo', key: 'ASolicitarFestivo', width: 15, style: { numFmt: '0.000' } },
        { header: 'Entradas registradas en turno', key: 'Entradas', width: 30 },
      ];

      data.forEach((item) => worksheet.addRow(item));

      // Write to buffer
      const buffer = await workbook.xlsx.writeBuffer();
      const base64Content = Buffer.from(buffer as ArrayBuffer).toString('base64');

      // Build recipients
      const recipients = [{ Email: to, Name: 'Destinatario' }];
      const ccList = cc
        ? cc
            .replace(';', ',')
            .split(',')
            .map((email) => ({ Email: email.trim(), Name: 'CC' }))
        : [];

      // Send via Mailjet with inline attachment
      await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email: 'asada.pinon.cuentas.digitales@outlook.com',
              Name: 'Asada de Piñon',
            },
            To: recipients,
            Cc: ccList,
            Subject: subject || 'Reporte Cierre Vespertino - Bodega',
            TextPart: 'Se adjunta el reporte de cierre vespertino de bodega.',
            HTMLPart: '<p>Se adjunta el reporte de cierre vespertino de bodega.</p>',
            Attachments: [
              {
                ContentType:
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                Filename: 'cierre_vespertino.xlsx',
                Base64Content: base64Content,
              },
            ],
          },
        ],
      });

      this.logger.log(`Stock closing report sent via MAIL to ${to}`);
      return WsResponse.buildOkResponse('Report sent successfully');
    } catch (error) {
      this.logger.error('Error sending stock closing report', error);
      return WsResponse.buildErrorResponse(1, 'Error sending report via email', error?.message ?? error);
    }
  }
}
