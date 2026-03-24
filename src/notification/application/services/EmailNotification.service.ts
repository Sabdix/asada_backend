import mailjet from 'src/notification/infrastructure/config/mailjet.config';
import { MailNotificationDto } from '../dto/MailNotification.dto';
import { INotificationService } from '../interfaces/INotification.service';

export class EmailNotificationService implements INotificationService {
  async sendNotification(notification: MailNotificationDto) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    try {
      const cc = notification.cc
        .replace(';', ',')
        .split(',')
        .map((cc) => {
          return {
            Email: cc,
            Name: 'Manager',
          };
        });

      return await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email: 'asada.pinon.cuentas.digitales@outlook.com',
              Name: 'Asada de Piñon',
            },
            To: [
              {
                Email: notification.to,
                Name: 'Empleado',
              },
            ],
            Cc: cc,
            Subject: notification.subject,
            TemplateID: notification.templateId,
            TemplateLanguage: true,
            Variables: notification.dynamicTemplateData,
          },
        ],
      });
    } catch (ex) {
      console.error(ex);
    }
  }
}
