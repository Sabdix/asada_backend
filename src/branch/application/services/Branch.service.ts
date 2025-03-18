import { Injectable } from '@nestjs/common';
import { BranchRepository } from 'src/branch/infrastructure/repositories/branch.repository';
import { CreateBranchRequestDto } from '../dtos/CreateBranchRequest.dto';
import { Branch } from 'src/branch/domain/entities/Branch.entity';

@Injectable()
export class BranchService {
    constructor(private readonly branchRepository: BranchRepository) { }

    creteBranch(request: CreateBranchRequestDto) {
        return this.branchRepository.save(
            this.branchRepository.create({
                name: request.name,
                lat: request.lat,
                lng: request.lng,
                street: request.street,
                neigborhood: request.neigborhood,
                zip_code: request.zip_code,
                internal_number: request.internal_number ?? '',
                external_number: request.external_number,
                state: request.state,
                locality: request.locality
            })
        )
    }

    getBranchByName(name: string) {
        return this.branchRepository.findOneBy({ name: name });
    }

    getBranchByUuid(uuid: string) {
        return this.branchRepository.findOneBy({ uuid: uuid });
    }

    getBranches() {
        return this.branchRepository.find();
    }

    deleteBranch(uuid: string) {
        return this.branchRepository.softDelete({ uuid: uuid });
    }

    UpdateBranch(branch: Branch) {
        return this.branchRepository.save(branch);
    }
}
