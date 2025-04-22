import { EntityBase } from 'src/common/entities/EntityBase';
import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { CheckListHistory } from './CheckListHistory';
import { CheckListItemCriteriaAnswers } from './CheckListItemCriteriaAnswers.entity';

@Entity()
export class CheckListUserAnswers extends EntityBase {
    @Column()
    uuid_check_list_history: string;
    @Column()
    uuid_check_list_item_criteria_answer: string;
    @Column({ nullable: true })
    comment: string;

    @ManyToOne(() => CheckListHistory)
    @JoinColumn({ name: 'uuid_check_list_history' })
    check_list_history: CheckListHistory

    @ManyToOne(() => CheckListItemCriteriaAnswers)
    @JoinColumn({ name: 'uuid_check_list_criteria_answer' })
    check_list_criteria_answer: CheckListItemCriteriaAnswers
}