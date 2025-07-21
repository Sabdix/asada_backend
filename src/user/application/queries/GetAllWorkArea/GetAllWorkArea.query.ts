import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { UserDto } from '../../dtos/User.dto';
import { WorkAreaDto } from '../../dtos/WorkArea.dto';

export class GetAllWorkAreaQuery extends Query<WsResponse<WorkAreaDto[] | string>> {
  constructor() {
    super();
  }
}
