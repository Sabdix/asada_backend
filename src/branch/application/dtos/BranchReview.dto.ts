import { Expose, Type } from 'class-transformer';
import { UserBranchDto } from 'src/user/application/dtos/UserBranch.dto';

export class BranchReviewDto {
    @Expose()
    uuid: string;
    @Expose()
    name: string;
    @Expose()
    comment: string;
    @Expose()
    rate: number;

    @Expose()
    @Type(() => UserBranchDto)
    branch: UserBranchDto;
}
