import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { EntityBase } from '../../../common/entities/EntityBase';
import { StockRequest } from './StockRequest.entity';

@Entity('stock_request_detail')
export class StockRequestDetail extends EntityBase {
  @Column()
  uuid_stock_request: string;

  @Column()
  producto: string;

  @Column({ nullable: true })
  unidad_medida: string;

  @Column({ nullable: true })
  cantidad_requerida: string;

  @Column({ nullable: true })
  cantidad_requerida_festivo: string;

  @Column({ nullable: true })
  fecha: string;

  @Column({ nullable: true })
  cantidad_actual: string;

  @Column({ nullable: true })
  cantidad_previa: string;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  a_solicitar: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  a_solicitar_festivo: number;

  @Column({ nullable: true })
  revisor: string;

  @Column({ nullable: true })
  tipo: string;

  @Column({ nullable: true })
  checklist: string;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  entradas: number;

  @Column({ nullable: true })
  diferencia: string;

  @Column({ nullable: true })
  turno: string;

  @ManyToOne(() => StockRequest, (request) => request.details)
  @JoinColumn({ name: 'uuid_stock_request' })
  stockRequest: StockRequest;
}
