import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';

export class DownloadReviewReport64Query extends Query<WsResponse<string | string>> {
    constructor(
        public readonly initialDate: Date,
        public readonly endDate: Date
    ) {
        super();
    }
}
