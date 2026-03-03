import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './Role.entity';
import { Schedule } from '../../../schedule/domain/entities/Schedule.entity';
import { Branch } from '../../../branch/domain/entities/Branch.entity';
import { EntityBase } from '../../../common/entities/EntityBase';
import { WorkArea } from './WorkArea.entity';

@Entity()
export class User extends EntityBase {
  @Column()
  name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  second_last_name: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  mail: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({ nullable: true })
  secret: string;

  @Column({ nullable: true })
  uuid_role: string;

  @Column({ nullable: true })
  uuid_schedule: string;

  @Column({ nullable: true })
  uuid_user: string | null;

  @Column({ nullable: true })
  uuid_branch: string;

  @Column({ nullable: true })
  uuid_work_area: string;

  @Column({ default: true })
  change_password: boolean;

  @Column({ default: false })
  empowered: boolean;

  @Column({ default: false })
  stock_empowered: boolean;

  @Column({ nullable: true })
  mail_alertas: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'uuid_role' })
  role: Role;

  @ManyToOne(() => Schedule)
  @JoinColumn({ name: 'uuid_schedule' })
  schedule: Schedule;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'uuid_branch' })
  branch: Branch;

  // Si 'uuid_user' apunta a otro usuario para relaciones jerárquicas, puedes agregar:
  @ManyToOne(() => User)
  @JoinColumn({ name: 'uuid_user' })
  manager: User | null;

  @ManyToOne(() => WorkArea)
  @JoinColumn({ name: 'uuid_work_area' })
  workArea: WorkArea | null;
}
