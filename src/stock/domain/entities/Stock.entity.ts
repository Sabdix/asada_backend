import { EntityBase } from '../../../common/entities/EntityBase';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProductCategory } from './ProductCategory.entity';
import { Branch } from '../../../branch/domain/entities/Branch.entity';
import { StockProduct } from './StockProduct.entity';
import { WorkArea } from '../../../user/domain/entities/WorkArea.entity';

@Entity('stock')
export class Stock extends EntityBase {
    @Column()
    uuid_category: string;

    @Column()
    uuid_product: string;

    @Column()
    uuid_branch: string;
    
    @Column()
    uuid_work_area: string;

    @Column({ type: 'decimal', precision: 10, scale: 3 })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 3 })
    requiredStock: number;

    @Column({ type: 'decimal', precision: 10, scale: 3 })
    holidayRequiredStock: number;

    @ManyToOne(() => ProductCategory)
    @JoinColumn({ name: 'uuid_category' })
    category: ProductCategory;

    @ManyToOne(() => Branch)
    @JoinColumn({ name: 'uuid_branch' })
    branch: Branch;

    @ManyToOne(() => StockProduct)
    @JoinColumn({ name: 'uuid_product' })
    product: StockProduct;

    @ManyToOne(() => WorkArea)
    @JoinColumn({ name: 'uuid_work_area' })
    workArea: WorkArea;
}