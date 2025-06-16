import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';

export class DownloadReviewReportQuery extends Query<WsResponse<string | Buffer>> {
    constructor(
        public readonly initialDate: Date,
        public readonly endDate: Date,
        public readonly branchId: string
    ) {
        super();
    }
}
