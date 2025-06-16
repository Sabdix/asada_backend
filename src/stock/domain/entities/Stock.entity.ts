import { EntityBase } from 'src/common/entities/EntityBase';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProductCategory } from './ProductCategory.entity';
import { Branch } from 'src/branch/domain/entities/Branch.entity';
import { StockProduct } from './StockProduct.entity';

@Entity('stock')
export class Stock extends EntityBase {
    @Column()
    uuid_category: string;

    @Column()
    uuid_product: string;

    @Column()
    uuid_branch: string;

    @Column({ type: 'decimal' })
    quantity: number;

    @Column({ type: 'decimal' })
    requiredStock: number;

    @Column({ type: 'decimal' })
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
}