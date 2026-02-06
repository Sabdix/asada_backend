import { EntityBase } from 'src/common/entities/EntityBase';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProductCategory } from './ProductCategory.entity';
import { Branch } from 'src/branch/domain/entities/Branch.entity';
import { StockProduct } from './StockProduct.entity';
import { WorkArea } from 'src/user/domain/entities/WorkArea.entity';

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

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    requiredStock: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
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