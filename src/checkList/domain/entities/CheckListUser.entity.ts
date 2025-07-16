import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../../user/domain/entities/User.entity';
import { CheckList } from './CheckList.entity';
import { EntityBase } from 'src/common/entities/EntityBase';

@Entity()
export class CheckListUser extends EntityBase {
  @Column({ nullable: true })
  uuid_user: string;

  @Column()
  weekDay: number;

  @Column()
  initHour: string;

  @Column()
  endHour: string;

  @Column({default: false})
  specialEvent: boolean;

  @Column({ type: 'date', nullable: true})
  eventDate: Date;

  @Column()
  uuid_check_list: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uuid_user' })
  user: User

  @ManyToOne(() => CheckList)
  @JoinColumn({ name: 'uuid_check_list' })
  checkList: CheckList;
}