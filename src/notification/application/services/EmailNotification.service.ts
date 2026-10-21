import mailjet from 'src/notification/infrastructure/config/mailjet.config';
import { MailNotificationDto } from '../dto/MailNotification.dto';
import { INotificationService } from '../interfaces/INotification.service';

export class EmailNotificationService implements INotificationService {
  async sendNotification(notification: MailNotificationDto) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    try {
      const cc = notification.cc
        ? notification.cc
            .split(/[,;]+/)
            .map((email) => email.trim())
            .filter((email) => Boolean(email))
            .map((email) => ({
              Email: email,
              Name: 'Manager',
            }))
        : undefined;

      const message: any = {
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
        Subject: notification.subject,
        TemplateID: notification.templateId,
        TemplateLanguage: true,
        Variables: notification.dynamicTemplateData,
      };

      if (cc && cc.length > 0) {
        message.Cc = cc;
      }

      return await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [message],
      });
    } catch (ex) {
      console.error(ex);
    }
  }
}
