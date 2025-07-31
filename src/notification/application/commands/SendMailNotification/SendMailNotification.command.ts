import { Command } from '@nestjs/cqrs';
import { MailNotificationDto } from '../../dto/MailNotification.dto';

export class SendMailNotificationCommand extends Command<boolean> {
  constructor(public readonly data: MailNotificationDto) {
    super();
  }
}
