export class MailNotificationDto implements INotificationDto {
  templateId: string;
  to: string;
  cc: string
  subject: string;
  dynamicTemplateData: Object;
}
