import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SendMailNotificationCommand } from 'src/notification/application/commands/SendMailNotification/SendMailNotification.command';
import { MailNotificationDto } from 'src/notification/application/dto/MailNotification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('mail/send')
  async sendMailNotification(@Body() body: MailNotificationDto) {
    await this.commandBus.execute(new SendMailNotificationCommand(body));
  }
}
