import { EntityBase } from 'src/common/entities/EntityBase';
import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BaseEntity } from 'typeorm';

@Entity()
export class Schedule extends EntityBase{
  @Column()
  name: string;
}