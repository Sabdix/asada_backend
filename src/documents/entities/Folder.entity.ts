import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { EntityBase } from '../../common/entities/EntityBase';
import { Document } from './Document.entity';

@Entity('folders')
@Index(['parentId', 'name'], { unique: true })
export class Folder extends EntityBase {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'parent_id', type: 'varchar', length: 36, nullable: true })
  parentId: string | null;

  @ManyToOne(() => Folder, (folder) => folder.subfolders, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Folder | null;

  @OneToMany(() => Folder, (folder) => folder.parent)
  subfolders: Folder[];

  @OneToMany(() => Document, (doc) => doc.folder)
  documents: Document[];

  @Column({ name: 'created_by', type: 'varchar', length: 255, nullable: true })
  createdBy: string | null;
}
