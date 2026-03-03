import { Injectable } from '@nestjs/common';
import { CheckListGroupCheckListRepository } from 'src/checkList/infrastructure/repositories/CheckListGroupCheckList.Repository';
import { CheckListGroupCheckList } from 'src/checkList/domain/entities/CheckListGroupCheckList.entity';

@Injectable()
export class CheckListGroupCheckListService {
  constructor(
    private readonly checkListGroupCheckListRepository: CheckListGroupCheckListRepository,
  ) {}

  createCheckListGroupCheckList(
    uuidGroup: string,
    uuidCheckList: string,
    priority: number,
  ) {
    return this.checkListGroupCheckListRepository.save(
      this.checkListGroupCheckListRepository.create({
        uuid_check_list_group: uuidGroup,
        uuid_check_list: uuidCheckList,
        priority: priority,
      }),
    );
  }

  getByGroupUuid(uuidGroup: string) {
    return this.checkListGroupCheckListRepository.find({
      where: { uuid_check_list_group: uuidGroup },
      relations: ['checkList'],
      order: { priority: 'ASC' },
    });
  }

  deleteByGroupUuid(uuidGroup: string) {
    return this.checkListGroupCheckListRepository.delete({
      uuid_check_list_group: uuidGroup,
    });
  }

  deleteByGroupAndCheckList(uuidGroup: string, uuidCheckList: string) {
    return this.checkListGroupCheckListRepository.delete({
      uuid_check_list_group: uuidGroup,
      uuid_check_list: uuidCheckList,
    });
  }

  updatePriority(
    uuidGroup: string,
    uuidCheckList: string,
    priority: number,
  ) {
    return this.checkListGroupCheckListRepository.update(
      {
        uuid_check_list_group: uuidGroup,
        uuid_check_list: uuidCheckList,
      },
      { priority: priority },
    );
  }
}
