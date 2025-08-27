import { Injectable } from '@nestjs/common';
import { Role } from 'src/user/domain/entities/Role.entity';
import { CheckListRepository } from 'src/checkList/infrastructure/repositories/CheckList.Repository';
import { CreateCheckListRequestDto } from '../dtos/CreateCheckList.dto';
import { CheckList } from 'src/checkList/domain/entities/CheckList.entity';

@Injectable()
export class CheckListService {
    constructor(private readonly chekListRepository: CheckListRepository) { }

    creteCheckList(request: CreateCheckListRequestDto) {
        return this.chekListRepository.save(
            this.chekListRepository.create({
                name: request.name
            })
        )
    }

    getCheckListByName(name: string) {
        return this.chekListRepository.findOneBy({ name: name });
    }

    getCheckListByUuid(uuid: string) {
        return this.chekListRepository.findOneBy({ uuid: uuid });
    }


    getCheckList() {
        return this.chekListRepository.find({ order: { name: 'ASC' } });
    }

    async getCheckListPaginated(name: string) {
        const queryBuilder = this.chekListRepository
            .createQueryBuilder('checkList')
            .leftJoin('check_list_item', 'checkListItem', 'checkListItem.uuid_check_list = checkList.uuid')
            .addSelect('COUNT(checkListItem.uuid)', 'itemCount')
            .groupBy('checkList.uuid')
            .orderBy('checkList.name', 'ASC')

        if (name) {
            queryBuilder.andWhere(`LOWER(checkList.name) LIKE LOWER(:name)`, { name: `%${name}%` });
        }

        const { entities, raw } = await queryBuilder.getRawAndEntities();
        
        return entities.map((entity, index) => ({
            ...entity,
            checkListItemCount: parseInt(raw[index].itemCount)
        }));
    }

    deleteCheckList(uuid: string) {
        return this.chekListRepository.softDelete({ uuid: uuid });
    }

    updateCheckList(checkList: CheckList) {
        return this.chekListRepository.save(checkList);
    }

}
