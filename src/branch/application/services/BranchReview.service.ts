import { Injectable } from '@nestjs/common';
import { Branch } from 'src/branch/domain/entities/Branch.entity';
import { BranchReviewRepository } from 'src/branch/infrastructure/repositories/branchReview.repository';
import { CreateBranchReviewRequestDto } from '../dtos/CreateBranchReviewRequest.dto';
import { Between, LessThanOrEqual } from 'typeorm';
import { of } from 'rxjs';

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
        //return this.branchReviewRepository.find({ relations: ['branch'], withDeleted: true });

        return this.branchReviewRepository
            .createQueryBuilder('br')
            .leftJoinAndSelect(
                'br.branch',
                'b',
                'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL'
            )
            .where('br.deletedAt IS NULL')
            .getMany();
    }

    getBranchReviewsPaginated(size: number, offset: number) {
        //return this.branchReviewRepository.find({ relations: ['branch'], withDeleted: true });

        return this.branchReviewRepository
            .createQueryBuilder('br')
            .leftJoinAndSelect(
                'br.branch',
                'b',
                'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL'
            )
            .where('br.deletedAt IS NULL')
            .skip(offset)
            .take(size)
            .getManyAndCount();
    }

    getBranchReviewsByUuid(uuid: string) {
        // return this.branchReviewRepository.find({ where: { uuid_branch: uuid }, relations: ['branch'], withDeleted: true });
        return this.branchReviewRepository
            .createQueryBuilder('br')
            .leftJoinAndSelect(
                'br.branch',
                'b',
                'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL'
            )
            .where('br.uuid_branch = :uuid', { uuid })
            .andWhere('br.deletedAt IS NULL')
            .getMany();
    }

    getBranchReviewsByUuidPaginated(uuid: string, size: number, offset: number) {
        // return this.branchReviewRepository.find({ where: { uuid_branch: uuid }, relations: ['branch'], withDeleted: true });
        return this.branchReviewRepository
            .createQueryBuilder('br')
            .leftJoinAndSelect(
                'br.branch',
                'b',
                'b.deletedAt IS NOT NULL OR b.deletedAt IS NULL'
            )
            .where('br.uuid_branch = :uuid', { uuid })
            .andWhere('br.deletedAt IS NULL')
            .skip(offset)
            .take(size)
            .getManyAndCount();
    }

    getAllReviewsByRangeTime(initialDate: Date, endDate: Date) {
        // return this.branchReviewRepository
        //     .createQueryBuilder('branchReview')
        //     .select([
        //         'branchReview.name',
        //         'branchReview.rate',
        //         'branchReview.comment',
        //         'branchReview.createdAt',
        //         'branch.name',
        //     ])
        //     .leftJoinAndSelect('branchReview.branch', 'branch')
        //     .withDeleted()
        //     .where('branchReview.createdAt BETWEEN :initialDate AND :endDate', { initialDate, endDate })
        //     .andWhere('branchReview.rate <= :maxRate', { maxRate: 3 })
        //     .orderBy('branchReview.rate', 'ASC')
        //     .getMany();

        return this.branchReviewRepository
            .createQueryBuilder('branchReview')
            .select([
                'branchReview.name',
                'branchReview.rate',
                'branchReview.comment',
                'branchReview.createdAt',
                'branch.name',
            ])
            .leftJoinAndSelect(
                'branchReview.branch',
                'branch',
                'branch.deletedAt IS NOT NULL OR branch.deletedAt IS NULL'
            )
            .where('branchReview.createdAt BETWEEN :initialDate AND :endDate', { initialDate, endDate })
            .andWhere('branchReview.rate <= :maxRate', { maxRate: 3 })
            .andWhere('branchReview.deletedAt IS NULL')
            .orderBy('branchReview.rate', 'ASC')
            .getMany();
    }

    getBranchReviewsByRangeTime(initialDate: Date, endDate: Date, uuid_branch: string) {
        // return this.branchReviewRepository
        //     .createQueryBuilder('branchReview')
        //     .select([
        //         'branchReview.name',
        //         'branchReview.rate',
        //         'branchReview.comment',
        //         'branchReview.createdAt',
        //         'branch.name',
        //     ])
        //     .leftJoinAndSelect('branchReview.branch', 'branch')
        //     .withDeleted()
        //     .where('branchReview.createdAt BETWEEN :initialDate AND :endDate', { initialDate, endDate })
        //     .andWhere('branchReview.rate <= :maxRate', { maxRate: 3 })
        //     .orderBy('branchReview.rate', 'ASC')
        //     .getMany();

        return this.branchReviewRepository
            .createQueryBuilder('branchReview')
            .select([
                'branchReview.name',
                'branchReview.rate',
                'branchReview.comment',
                'branchReview.createdAt',
                'branch.name',
            ])
            .leftJoinAndSelect(
                'branchReview.branch',
                'branch',
                'branch.deletedAt IS NOT NULL OR branch.deletedAt IS NULL'
            )
            .where('branchReview.createdAt BETWEEN :initialDate AND :endDate', { initialDate, endDate })
            .andWhere('branch.uuid = :uuid_branch', { uuid_branch })
            .andWhere('branchReview.rate <= :maxRate', { maxRate: 3 })
            .andWhere('branchReview.deletedAt IS NULL')
            .orderBy('branchReview.rate', 'ASC')
            .getMany();
    }
}
