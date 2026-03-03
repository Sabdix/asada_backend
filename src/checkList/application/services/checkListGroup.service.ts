import { Injectable } from '@nestjs/common';
import { CheckListGroupRepository } from 'src/checkList/infrastructure/repositories/CheckListGroup.Repository';
import { CreateCheckListGroupRequestDto } from '../dtos/CreateCheckListGroup.dto';
import { CheckListGroup } from 'src/checkList/domain/entities/CheckListGroup.entity';

@Injectable()
export class CheckListGroupService {
  constructor(
    private readonly checkListGroupRepository: CheckListGroupRepository,
  ) {}

  createCheckListGroup(request: CreateCheckListGroupRequestDto) {
    return this.checkListGroupRepository.save(
      this.checkListGroupRepository.create({
        name: request.name,
      }),
    );
  }

  getCheckListGroupByName(name: string) {
    return this.checkListGroupRepository.findOneBy({ name: name });
  }

  getCheckListGroupByUuid(uuid: string) {
    return this.checkListGroupRepository.findOneBy({ uuid: uuid });
  }

  getCheckListGroups(name?: string) {
    const queryBuilder = this.checkListGroupRepository
      .createQueryBuilder('checkListGroup')
      .orderBy('checkListGroup.name', 'ASC');

    if (name) {
      queryBuilder.andWhere(`LOWER(checkListGroup.name) LIKE LOWER(:name)`, {
        name: `%${name}%`,
      });
    }

    return queryBuilder.getMany();
  }

  deleteCheckListGroup(uuid: string) {
    return this.checkListGroupRepository.softDelete({ uuid: uuid });
  }

  updateCheckListGroup(checkListGroup: CheckListGroup) {
    return this.checkListGroupRepository.save(checkListGroup);
  }
}
