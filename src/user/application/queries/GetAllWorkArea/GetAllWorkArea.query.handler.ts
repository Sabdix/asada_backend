import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetAllWorkAreaQuery } from './GetAllWorkArea.query';
import { WorkAreaService } from '../../services/workArea.service';
import { WorkAreaDto } from '../../dtos/WorkArea.dto';

@QueryHandler(GetAllWorkAreaQuery)
export class GetAllWorkAreaQueryHandler implements IQueryHandler<GetAllWorkAreaQuery> {
  constructor(private  workAreaService: WorkAreaService) {}

  async execute(): Promise<WsResponse<WorkAreaDto[]>> {
    const workArea = await this.workAreaService.getAllWorkArea();

    return WsResponse.buildOkResponse(
      plainToInstance(WorkAreaDto, workArea, { excludeExtraneousValues: true }),
    );
  }
}
