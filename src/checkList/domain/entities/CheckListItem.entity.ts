import { EntityBase } from 'src/common/entities/EntityBase';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CheckList } from './CheckList.entity';

@Entity()
export class CheckListItem extends EntityBase {
  @Column()
  name: string;
  @Column()
  uuid_check_list

  @ManyToOne(() => CheckList, (checkList) => checkList.checkListItems)
  @JoinColumn({ name: 'uuid_check_list' })
  check_list: CheckList
}