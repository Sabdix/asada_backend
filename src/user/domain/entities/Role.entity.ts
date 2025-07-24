import { EntityBase } from 'src/common/entities/EntityBase';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { WorkArea } from './WorkArea.entity';

@Entity()
export class Role extends EntityBase {
  @Column()
  name: string;

  @Column()
  hierarchy: string;

  @Column({ nullable: true })
  uuid_work_area: string;

  @ManyToOne(() => WorkArea)
  @JoinColumn({ name: 'uuid_work_area' })
  workArea: WorkArea | null;
}