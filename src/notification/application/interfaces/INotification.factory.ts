import { INotificationService } from './INotification.service';

export interface INotificationFactory {
  createNotificationService(): INotificationService;
}
