import { EntityBase } from 'src/common/entities/EntityBase';
import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BaseEntity } from 'typeorm';

@Entity()
export class Branch extends EntityBase {
  @Column()
  name: string;

  @Column('double')
  lat: number;

  @Column('double')
  lng: number;

  @Column()
  street: string;

  @Column()
  neigborhood: string;

  @Column()
  zip_code: number;

  @Column()
  internal_number: string;

  @Column()
  external_number: string;

  @Column()
  state: string;

  @Column()
  locality: string;
}