import { EntityBase } from 'src/common/entities/EntityBase';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CheckList } from './CheckList.entity';
import { User } from 'src/user/domain/entities/User.entity';

@Entity()
export class CheckListHistory extends EntityBase {
    @Column({ type: 'date' })
    date: Date;
    @Column()
    status: boolean;
    @Column()
    uuid_check_list
    @Column()
    uuid_user: string;

    @ManyToOne(() => CheckList)
    @JoinColumn({ name: 'uuid_check_list' })
    check_list: CheckList

    @ManyToOne(() => User)
    @JoinColumn({ name: 'uuid_user' })
    user: User

}