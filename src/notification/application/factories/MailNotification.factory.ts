import { INotificationFactory } from '../interfaces/INotification.factory';
import { INotificationService } from '../interfaces/INotification.service';
import { EmailNotificationService } from '../services/EmailNotification.service';

export class MailNotificationFactory implements INotificationFactory {
  public createNotificationService(): INotificationService {
    return new EmailNotificationService();
  }
}
