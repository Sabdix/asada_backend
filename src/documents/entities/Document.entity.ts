import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { EntityBase } from '../../common/entities/EntityBase';
import { Folder } from './Folder.entity';

@Entity('documents')
@Index(['folderId', 'originalName'])
export class Document extends EntityBase {
  @Index()
  @Column({ name: 'original_name', type: 'varchar', length: 255 })
  originalName: string;

  @Column({ name: 'stored_filename', type: 'varchar', length: 255 })
  storedFilename: string;

  @Column({ name: 'mime_type', type: 'varchar', length: 150 })
  mimeType: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column({ name: 'folder_id', type: 'varchar', length: 36, nullable: true })
  folderId: string | null;

  @ManyToOne(() => Folder, (folder) => folder.documents, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'folder_id' })
  folder: Folder | null;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ name: 'uploaded_by', type: 'varchar', length: 255, nullable: true })
  uploadedBy: string | null;
}
