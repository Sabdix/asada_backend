import { EntityBase } from '../../../common/entities/EntityBase';
import { Entity, Column} from 'typeorm';

@Entity()
export class Schedule extends EntityBase{
  @Column()
  name: string;
}