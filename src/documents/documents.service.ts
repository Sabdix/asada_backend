import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Folder } from './entities/Folder.entity';
import { Document } from './entities/Document.entity';
import { CreateFolderDto, RenameFolderDto } from './dto/Folder.dto';
import { UpdateDocumentDto, SearchDocumentsDto } from './dto/Document.dto';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'node:crypto';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);
  private readonly storagePath: string;

  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly configService: ConfigService,
  ) {
    // Almacenamiento local seguro fuera de la carpeta pública
    const customPath = this.configService.get<string>('STORAGE_PATH');
    this.storagePath = customPath
      ? path.resolve(customPath)
      : path.resolve(process.cwd(), '../secure_storage');

    this.ensureStorageDirectoryExists();
  }

  private ensureStorageDirectoryExists() {
    try {
      if (!fs.existsSync(this.storagePath)) {
        fs.mkdirSync(this.storagePath, { recursive: true });
        this.logger.log(`Directorio de almacenamiento seguro creado en: ${this.storagePath}`);
      }
    } catch (error: any) {
      this.logger.error(`Error creando directorio de almacenamiento: ${error?.message || error}`);
    }
  }

  // --- CARPETAS ---

  async createFolder(dto: CreateFolderDto, userId?: string): Promise<Folder> {
    if (dto.parentId) {
      const parent = await this.folderRepository.findOne({ where: { uuid: dto.parentId } });
      if (!parent) {
        throw new NotFoundException(`Carpeta padre con ID ${dto.parentId} no encontrada`);
      }
    }

    const existing = await this.folderRepository.findOne({
      where: {
        name: dto.name,
        parentId: dto.parentId ? dto.parentId : IsNull(),
      },
    });

    if (existing) {
      throw new BadRequestException(`Ya existe una carpeta con el nombre "${dto.name}" en esta ubicación`);
    }

    const folder = this.folderRepository.create({
      name: dto.name,
      parentId: dto.parentId || null,
      createdBy: userId || null,
    });

    return await this.folderRepository.save(folder);
  }

  async renameFolder(id: string, dto: RenameFolderDto): Promise<Folder> {
    const folder = await this.getFolderById(id);

    const existing = await this.folderRepository.findOne({
      where: {
        name: dto.name,
        parentId: folder.parentId ? folder.parentId : IsNull(),
      },
    });

    if (existing && existing.uuid !== id) {
      throw new BadRequestException(`Ya existe una carpeta con el nombre "${dto.name}" en este nivel`);
    }

    folder.name = dto.name;
    return await this.folderRepository.save(folder);
  }

  async getFolderContent(folderId?: string) {
    let currentFolder: Folder | null = null;
    let breadcrumbs: { id: string; name: string }[] = [];

    if (folderId) {
      currentFolder = await this.getFolderById(folderId);
      breadcrumbs = await this.getBreadcrumbs(folderId);
    }

    const folders = await this.folderRepository.find({
      where: { parentId: folderId ? folderId : IsNull() },
      order: { name: 'ASC' },
    });

    const documents = await this.documentRepository.find({
      where: { folderId: folderId ? folderId : IsNull() },
      order: { createdAt: 'DESC' },
    });

    return {
      currentFolder,
      breadcrumbs,
      folders,
      documents,
    };
  }

  async getFolderById(id: string): Promise<Folder> {
    const folder = await this.folderRepository.findOne({ where: { uuid: id } });
    if (!folder) {
      throw new NotFoundException(`Carpeta con ID ${id} no encontrada`);
    }
    return folder;
  }

  async deleteFolder(id: string): Promise<{ message: string }> {
    const folder = await this.folderRepository.findOne({
      where: { uuid: id },
      relations: { subfolders: true, documents: true },
    });

    if (!folder) {
      throw new NotFoundException(`Carpeta con ID ${id} no encontrada`);
    }

    await this.deleteFolderRecursively(id);

    return { message: 'Carpeta y su contenido eliminados exitosamente' };
  }

  private async deleteFolderRecursively(folderId: string) {
    const subfolders = await this.folderRepository.find({ where: { parentId: folderId } });
    for (const sub of subfolders) {
      await this.deleteFolderRecursively(sub.uuid);
    }

    const docs = await this.documentRepository.find({ where: { folderId } });
    for (const doc of docs) {
      this.deletePhysicalFile(doc.storedFilename);
    }

    await this.folderRepository.delete(folderId);
  }

  private async getBreadcrumbs(folderId: string): Promise<{ id: string; name: string }[]> {
    const crumbs: { id: string; name: string }[] = [];
    let currentId: string | null = folderId;

    while (currentId) {
      const folder = await this.folderRepository.findOne({ where: { uuid: currentId } });
      if (!folder) break;
      crumbs.unshift({ id: folder.uuid, name: folder.name });
      currentId = folder.parentId;
    }

    return crumbs;
  }

  // --- DOCUMENTOS ---

  async saveUploadedFile(
    file: Express.Multer.File,
    folderId?: string,
    metadata?: Record<string, any>,
    userId?: string,
  ): Promise<Document> {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    if (folderId) {
      await this.getFolderById(folderId);
    }

    const fileExtension = path.extname(file.originalname);
    const storedFilename = `${randomUUID()}${fileExtension}`;
    const destinationPath = path.join(this.storagePath, storedFilename);

    try {
      await fs.promises.writeFile(destinationPath, file.buffer);
    } catch (err: any) {
      this.logger.error(`Error guardando archivo físico: ${err?.message || err}`);
      throw new InternalServerErrorException('Error al guardar el archivo en almacenamiento físico');
    }

    const document = this.documentRepository.create({
      originalName: file.originalname,
      storedFilename,
      mimeType: file.mimetype,
      size: file.size,
      folderId: folderId || null,
      metadata: metadata || {},
      uploadedBy: userId || null,
    });

    return await this.documentRepository.save(document);
  }

  async getDocumentById(id: string): Promise<Document> {
    const doc = await this.documentRepository.findOne({
      where: { uuid: id },
      relations: { folder: true },
    });

    if (!doc) {
      throw new NotFoundException(`Documento con ID ${id} no encontrado`);
    }

    return doc;
  }

  getDocumentStream(doc: Document): { stream: fs.ReadStream; filePath: string } {
    const filePath = path.join(this.storagePath, doc.storedFilename);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('El archivo físico no fue encontrado en el servidor de almacenamiento');
    }
    return {
      stream: fs.createReadStream(filePath),
      filePath,
    };
  }

  async updateDocument(id: string, dto: UpdateDocumentDto): Promise<Document> {
    const doc = await this.getDocumentById(id);

    if (dto.originalName !== undefined) {
      doc.originalName = dto.originalName;
    }

    if (dto.folderId !== undefined) {
      if (dto.folderId !== null) {
        await this.getFolderById(dto.folderId);
      }
      doc.folderId = dto.folderId;
    }

    if (dto.metadata !== undefined) {
      doc.metadata = { ...doc.metadata, ...dto.metadata };
    }

    return await this.documentRepository.save(doc);
  }

  async deleteDocument(id: string): Promise<{ message: string }> {
    const doc = await this.getDocumentById(id);
    this.deletePhysicalFile(doc.storedFilename);
    await this.documentRepository.remove(doc);

    return { message: 'Documento eliminado exitosamente' };
  }

  private deletePhysicalFile(storedFilename: string) {
    try {
      const filePath = path.join(this.storagePath, storedFilename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error: any) {
      this.logger.error(`Error al eliminar archivo físico ${storedFilename}: ${error?.message || error}`);
    }
  }

  // --- BÚSQUEDA ---

  async search(queryDto: SearchDocumentsDto): Promise<Document[]> {
    const qb = this.documentRepository.createQueryBuilder('document');

    if (queryDto.q) {
      const term = `%${queryDto.q}%`;
      qb.where(
        '(document.originalName LIKE :term OR CAST(document.metadata AS CHAR) LIKE :term)',
        { term },
      );
    }

    if (queryDto.folderId) {
      qb.andWhere('document.folderId = :folderId', { folderId: queryDto.folderId });
    }

    if (queryDto.mimeType) {
      qb.andWhere('document.mimeType LIKE :mimeType', {
        mimeType: `%${queryDto.mimeType}%`,
      });
    }

    qb.orderBy('document.createdAt', 'DESC');

    return await qb.getMany();
  }
}
