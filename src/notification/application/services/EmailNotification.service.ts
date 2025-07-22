// import * as sgMail from '@sendgrid/mail';
// import mailjet from 'src/rabbit/infrastructure/config/mailjet.config';
import { MailNotificationDto } from '../dto/MailNotification.dto';
import { INotificationService } from '../interfaces/INotification.service';

export class EmailNotificationService implements INotificationService {
  async sendNotification(notification: MailNotificationDto) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    // sgMail.setApiKey(process.env.SG_API_KEY ?? '');
    try {
      //   return await mailjet.post('send', { version: 'v3.1' }).request({
      //     Messages: [
      //       {
      //         From: {
      //           Email: 'fondo@alsagro.com.mx',
      //           Name: 'Alsagro',
      //         },
      //         To: [
      //           {
      //             Email: notification.to,
      //             Name: 'Tecnico',
      //           },
      //         ],
      //         Subject: notification.subject,
      //         TemplateID: notification.templateId,
      //         TemplateLanguage: false,
      //         Variables: notification.dynamicTemplateData,
      //       },
      //     ],
      //   });
      // return await sgMail.send({
      //   to: notification.to,
      //   from: 'fondo@alsagro.com.mx', // Change to your verified sender
      //   subject: notification.subject,
      //   templateId: notification.templateId,
      //   dynamicTemplateData: notification.dynamicTemplateData,
      // });
    } catch (ex) {
      console.error(ex);
    }
  }
}
