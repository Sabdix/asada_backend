import { EntityBase } from '../../../common/entities/EntityBase';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CheckListGroup } from './CheckListGroup.entity';
import { CheckList } from './CheckList.entity';

@Entity()
export class CheckListGroupCheckList extends EntityBase {
  @Column()
  uuid_check_list_group: string;

  @Column()
  uuid_check_list: string;

  @Column({ type: 'int' })
  priority: number;

  @ManyToOne(() => CheckListGroup)
  @JoinColumn({ name: 'uuid_check_list_group' })
  checkListGroup: CheckListGroup;

  @ManyToOne(() => CheckList)
  @JoinColumn({ name: 'uuid_check_list' })
  checkList: CheckList;
}
