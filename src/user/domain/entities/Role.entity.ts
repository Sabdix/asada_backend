import { EntityBase } from 'src/common/entities/EntityBase';
import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class Role extends EntityBase {
  @Column()
  name: string;

  @Column()
  hierarchy: string;
}