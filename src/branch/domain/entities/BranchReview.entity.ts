import { EntityBase } from '../../../common/entities/EntityBase';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Branch } from './Branch.entity';

@Entity()
export class BranchReview extends EntityBase {

    @Column()
    name: string;

    @Column({ type: 'double' })
    rate: number;

    @Column()
    comment: string;

    @Column({ nullable: false })
    uuid_branch: string;

    @ManyToOne(() => Branch)
    @JoinColumn({ name: 'uuid_branch' })
    branch: Branch;
}