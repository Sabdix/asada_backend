export class MailNotificationDto implements INotificationDto {
  templateId: string;
  to: string;
  subject: string;
  dynamicTemplateData: Object;
}
