import { EntityBase } from 'src/common/entities/EntityBase';
import { Entity, Column, ManyToOne, JoinColumn} from 'typeorm';
import { CheckListItemCriteria } from './CheckListItemCriteria.entity';

@Entity()
export class CheckListItemCriteriaAnswers extends EntityBase {
  @Column()
  text: string;

  @Column({ nullable: true })
  uuid_check_list_item_criteria: string;

  @ManyToOne(() => CheckListItemCriteria)
  @JoinColumn({ name: 'uuid_check_list_item_criteria' })
  checkListItemCriteria: CheckListItemCriteria;
}