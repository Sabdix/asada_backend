import { EntityBase } from '../../../common/entities/EntityBase';
import { Entity, Column, OneToMany } from 'typeorm';
import { CheckListItem } from './CheckListItem.entity';

@Entity()
export class CheckList extends EntityBase {
  @Column()
  name: string;

  @OneToMany(() => CheckListItem, (checkListItem) => checkListItem.check_list)
  checkListItems: CheckListItem[]
}