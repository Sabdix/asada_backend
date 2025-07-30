import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendMailNotificationCommand } from './SendMailNotification.command';
import { INotificationService } from '../../interfaces/INotification.service';
import { MailNotificationFactory } from '../../factories/MailNotification.factory';
import { Logger } from '@nestjs/common';

@CommandHandler(SendMailNotificationCommand)
export class SendMailNotificationCommandHandler
  implements ICommandHandler<SendMailNotificationCommand>
{
  private readonly logger;
  constructor() {
    this.logger = new Logger(SendMailNotificationCommandHandler.name);
  }

  async execute(command: SendMailNotificationCommand): Promise<boolean> {
    this.logger.log(`Mail Message Recieved  MAIL => ${command.data.to}`);
    const notificationService: INotificationService =
      new MailNotificationFactory().createNotificationService();

    await notificationService.sendNotification(command.data);
    return true;
  }
}
