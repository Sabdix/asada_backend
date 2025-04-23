import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Schedule } from './Schedule.entity';
import { EntityBase } from 'src/common/entities/EntityBase';

@Entity()
export class ScheduleCalendar extends EntityBase {
  @Column('integer')
  weekDay: number;

  @Column()
  initHour: string;

  @Column()
  endHour: string;

  @Column()
  mealHourNumber: string;

  @Column({ nullable: true })
  uuid_schedule: string;

  @ManyToOne(() => Schedule)
  @JoinColumn({ name: 'uuid_schedule' })
  schedule: Schedule;
}