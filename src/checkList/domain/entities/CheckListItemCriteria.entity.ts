import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { EntityBase } from '../../../common/entities/EntityBase';
import { CheckListItem } from './CheckListItem.entity';

@Entity()
export class CheckListItemCriteria extends EntityBase {
  @Column()
  text: string;

  @Column({ nullable: true })
  uuid_check_list_item: string;

  @ManyToOne(() => CheckListItem)
  @JoinColumn({ name: 'uuid_check_list_item' })
  checkListItem: CheckListItem;
}