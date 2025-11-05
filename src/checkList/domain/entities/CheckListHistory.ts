import { EntityBase } from 'src/common/entities/EntityBase';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CheckList } from './CheckList.entity';
import { User } from 'src/user/domain/entities/User.entity';
import { CheckListUser } from './CheckListUser.entity';

@Entity()
export class CheckListHistory extends EntityBase {
    @Column({ type: 'date' })
    date: Date;
    @Column({default: 0})
    status: number;
    @Column({default: false})
    revised: boolean;
    @Column({nullable: true})
    comment: string;
    @Column({default: false})
    approved: boolean;
    @Column({default: false})
    managerRevised: boolean;
    @Column({nullable: true})
    managerComment: string;
    @Column({default: false})
    managerApproved: boolean;
    @Column()
    uuid_check_list
    @Column()
    uuid_user: string;
    @Column()
    uuid_check_list_user: string;

    @ManyToOne(() => CheckList)
    @JoinColumn({ name: 'uuid_check_list' })
    check_list: CheckList

    @ManyToOne(() => CheckListUser)
    @JoinColumn({ name: 'uuid_check_list_user' })
    check_list_user: CheckListUser

    @ManyToOne(() => User)
    @JoinColumn({ name: 'uuid_user' })
    user: User

}