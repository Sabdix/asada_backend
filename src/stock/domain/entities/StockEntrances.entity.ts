import { EntityBase } from '../../../common/entities/EntityBase';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Branch } from '../../../branch/domain/entities/Branch.entity';
import { User } from 'src/user/domain/entities/User.entity';
import { Stock } from './Stock.entity';

@Entity('stock_entrances')
export class StockEntrances extends EntityBase {
    @Column()
    uuid_branch: string;

    @Column()
    uuid_user: string;

    @Column()
    uuid_stock: string;

    @Column({ type: 'decimal', precision: 10, scale: 3 })
    quantity: number;

    @ManyToOne(() => Branch)
    @JoinColumn({ name: 'uuid_branch' })
    branch: Branch;

    @ManyToOne(() => Stock)
    @JoinColumn({ name: 'uuid_stock' })
    stock: Stock;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'uuid_user' })
    user: User;

}