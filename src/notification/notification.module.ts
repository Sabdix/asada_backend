import { Module } from '@nestjs/common';
import { SendMailNotificationCommandHandler } from './application/commands/SendMailNotification/SendMailNotification.command.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { NotificationController } from './infrastructure/controllers/notification.controller';

@Module({
  imports: [CqrsModule.forRoot()],
  providers: [SendMailNotificationCommandHandler],
  controllers: [NotificationController],
})
export class NotificationModule {}
