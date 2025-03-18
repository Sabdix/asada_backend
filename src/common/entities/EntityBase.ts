import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Generated,
    UpdateDateColumn,
  } from 'typeorm';
  
  export class EntityBase {
    @Column({ primary: true })
    @Generated('uuid')
    uuid: string;
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt?: Date;
  }
  