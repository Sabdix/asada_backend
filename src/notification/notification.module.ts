import { Module } from '@nestjs/common';
import { SendMailNotificationCommandHandler } from './application/commands/SendMailNotification/SendMailNotification.command.handler';

@Module({
  imports: [],
  providers: [SendMailNotificationCommandHandler],
})
export class NotificationModule {}
