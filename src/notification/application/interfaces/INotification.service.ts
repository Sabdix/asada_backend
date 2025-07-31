export interface INotificationService {
  sendNotification(notification: INotificationDto): Promise<any>;
}
