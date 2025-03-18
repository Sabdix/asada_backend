import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Schedule } from './Schedule.entity';
import { EntityBase } from 'src/common/entities/EntityBase';

@Entity()
export class ScheduleCalendar extends EntityBase {
  @Column('integer')
  weekDay: number;

  @Column('integer')
  initHour: number;

  @Column('integer')
  endHour: number;

  @Column('integer')
  mealHourNumber: number;

  @Column({ nullable: true })
  uuid_schedule: string;

  @ManyToOne(() => Schedule)
  @JoinColumn({ name: 'uuid_schedule' })
  schedule: Schedule;
}