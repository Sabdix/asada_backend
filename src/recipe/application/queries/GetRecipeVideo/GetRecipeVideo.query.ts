import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';

export class GetRecipeVideoQuery extends Query<WsResponse<Buffer | string>> {
    constructor(public readonly uuid: string) {
        super();
    }
}
