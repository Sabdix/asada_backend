import { EntityBase } from 'src/common/entities/EntityBase';
import { Entity, Column } from 'typeorm';

@Entity()
export class CheckList extends EntityBase {
  @Column()
  name: string;
}