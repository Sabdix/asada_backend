import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { EntityBase } from 'src/common/entities/EntityBase';
import { StockHistoryType } from '../enums/StockHistoryType.enum';
import { Stock } from './Stock.entity';
import { User } from 'src/user/domain/entities/User.entity';
import { CheckList } from 'src/checkList/domain/entities/CheckList.entity';

@Entity('stock_history')
export class StockHistory extends EntityBase {

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    previousQuantity: number;

    @Column({
        type: 'enum',
        enum: StockHistoryType
    })
    type: StockHistoryType;

    @Column({ type: 'date' })
    date: Date;

    @Column()
    uuid_stock: string;

    @Column()
    uuid_user: string;

    @Column({ nullable: true })
    uuid_check_list: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'uuid_user' })
    user: User;

    @ManyToOne(() => Stock)
    @JoinColumn({ name: 'uuid_stock' })
    stock: Stock;

    @ManyToOne(() => CheckList, { nullable: true })
    @JoinColumn({ name: 'uuid_check_list' })
    checklist: CheckList;
}