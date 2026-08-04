import { Entity, Column, OneToMany } from 'typeorm';
import { EntityBase } from '../../../common/entities/EntityBase';
import { StockRequestDetail } from './StockRequestDetail.entity';

@Entity('stock_request')
export class StockRequest extends EntityBase {
  @Column({ type: 'date' })
  date: Date;

  @Column()
  recipient_email: string;

  @Column({ nullable: true })
  cc: string;

  @Column({ nullable: true })
  subject: string;

  @Column({ nullable: true })
  uuid_branch: string;

  @Column()
  method: string;

  @Column({ default: 'sent' })
  status: string;

  @OneToMany(() => StockRequestDetail, (detail) => detail.stockRequest)
  details: StockRequestDetail[];
}
