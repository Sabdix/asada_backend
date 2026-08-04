import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { SendStockClosingReportCommand } from './SendStockClosingReport.command';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { SendMethod } from '../../dtos/SendStockClosingReportRequest.dto';
import { StockRequestService } from '../../services/StockRequest.service';
import { StockExcelBuilderService } from '../../services/StockExcelBuilder.service';
import mailjet from 'src/notification/infrastructure/config/mailjet.config';

@CommandHandler(SendStockClosingReportCommand)
export class SendStockClosingReportCommandHandler
  implements ICommandHandler<SendStockClosingReportCommand>
{
  private readonly logger = new Logger(
    SendStockClosingReportCommandHandler.name,
  );

  constructor(
    private readonly stockRequestService: StockRequestService,
    private readonly stockExcelBuilderService: StockExcelBuilderService,
  ) {}

  async execute(
    command: SendStockClosingReportCommand,
  ): Promise<WsResponse<string>> {
    const { method, to, cc, subject, data } = command.data;

    if (method === SendMethod.WHATSAPP) {
      return WsResponse.buildBadRequestResponse('WHATSAPP not implemented yet');
    }

    try {
      // Build Excel using the new format (grouped by category)
      const fecha = data[0]?.Fecha || new Date().toISOString().split('T')[0];
      const reportItems = data.map((item) => ({
        producto: item.Producto,
        unidadMedida: item.UnidadMedida,
        pedido: item.ASolicitar,
      }));

      const excelBuffer = await this.stockExcelBuilderService.buildReport(
        reportItems,
        fecha,
      );
      const base64Content = excelBuffer.toString('base64');

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
            Subject: subject || 'Pedido Bodega',
            TextPart: 'Se adjunta el pedido de bodega.',
            HTMLPart: '<p>Se adjunta el pedido de bodega.</p>',
            Attachments: [
              {
                ContentType:
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                Filename: 'pedido_bodega.xlsx',
                Base64Content: base64Content,
              },
            ],
          },
        ],
      });

      this.logger.log(`Stock closing report sent via MAIL to ${to}`);

      // Log the request to database
      await this.stockRequestService.createRequest(
        to,
        cc || '',
        subject || '',
        method,
        null,
        data,
      );

      return WsResponse.buildOkResponse('Report sent successfully');
    } catch (error) {
      this.logger.error('Error sending stock closing report', error);
      return WsResponse.buildErrorResponse(
        1,
        'Error sending report via email',
        error?.message ?? error,
      );
    }
  }
}
