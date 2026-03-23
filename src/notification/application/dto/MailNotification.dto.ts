export class MailNotificationDto implements INotificationDto {
  templateId: number;
  to: string;
  cc: string
  subject: string;
  dynamicTemplateData: Object;
}
