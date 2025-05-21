import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { DeleteMultipleAssignamentsDto } from '../../dtos/DeleteMultipleAssignaments.dto';

export class DeleteMultipleUserAssignamentCommand extends Command<WsResponse< null | string>> {
  constructor(public readonly request: DeleteMultipleAssignamentsDto) {
    super();
  }
}
