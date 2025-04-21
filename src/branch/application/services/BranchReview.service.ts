import { Injectable } from '@nestjs/common';
import { Branch } from 'src/branch/domain/entities/Branch.entity';
import { BranchReviewRepository } from 'src/branch/infrastructure/repositories/branchReview.repository';
import { CreateBranchReviewRequestDto } from '../dtos/CreateBranchReviewRequest.dto';

@Injectable()
export class BranchReviewService {
    constructor(private readonly branchReviewRepository: BranchReviewRepository) { }

    creteBranchReview(request: CreateBranchReviewRequestDto, branch: Branch) {
        return this.branchReviewRepository.save(
            this.branchReviewRepository.create({
                name: request.name,
                comment: request.comment,
                rate: request.rate,
                branch: branch
            })
        )
    }

    getBranchReviews() {
        return this.branchReviewRepository.find({ relations: ['branch'] });
    }

    getBranchReviewsByUuid(uuid: string) {
        return this.branchReviewRepository.find({ where: { uuid_branch: uuid }, relations: ['branch'] });
    }
}
