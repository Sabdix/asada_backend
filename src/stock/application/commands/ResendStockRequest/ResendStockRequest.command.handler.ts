import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { ResendStockRequestCommand } from './ResendStockRequest.command';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { StockRequestService } from '../../services/StockRequest.service';
import { StockExcelBuilderService } from '../../services/StockExcelBuilder.service';
import mailjet from 'src/notification/infrastructure/config/mailjet.config';

@CommandHandler(ResendStockRequestCommand)
export class ResendStockRequestCommandHandler
  implements ICommandHandler<ResendStockRequestCommand>
{
  private readonly logger = new Logger(ResendStockRequestCommandHandler.name);

  constructor(
    private readonly stockRequestService: StockRequestService,
    private readonly stockExcelBuilderService: StockExcelBuilderService,
  ) {}

  async execute(
    command: ResendStockRequestCommand,
  ): Promise<WsResponse<string>> {
    const { uuid, to, cc, subject } = command;

    try {
      // 1. Read saved detail from DB
      const details =
        await this.stockRequestService.getDetailByRequestUuid(uuid);

      if (!details || details.length === 0) {
        return WsResponse.buildNotFoundResponse('STOCK_REQUEST NOT FOUND');
      }

      // 2. Build Excel using the new format (grouped by category)
      const fecha = details[0]?.fecha || new Date().toISOString().split('T')[0];
      const reportItems = details.map((item) => ({
        producto: item.producto,
        unidadMedida: item.unidad_medida || '',
        pedido: Number(item.a_solicitar) || 0,
      }));

      const excelBuffer = await this.stockExcelBuilderService.buildReport(
        reportItems,
        fecha,
      );
      const base64Content = excelBuffer.toString('base64');

      // 3. Send via Mailjet
      const recipients = [{ Email: to, Name: 'Destinatario' }];
      const ccList = cc
        ? cc
            .replace(';', ',')
            .split(',')
            .map((email) => ({ Email: email.trim(), Name: 'CC' }))
        : [];

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

      this.logger.log(`Stock request ${uuid} resent via MAIL to ${to}`);

      // Update status to sent
      await this.stockRequestService.updateStatus(uuid, 'sent');

      return WsResponse.buildOkResponse('Report resent successfully');
    } catch (error) {
      this.logger.error('Error resending stock request', error);
      return WsResponse.buildErrorResponse(
        1,
        'Error resending report via email',
        error?.message ?? error,
      );
    }
  }
}
