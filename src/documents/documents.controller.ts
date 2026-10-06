import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  ParseUUIDPipe,
  HttpStatus,
  ParseFilePipeBuilder,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { DocumentsService } from './documents.service';
import { CreateFolderDto, RenameFolderDto } from './dto/Folder.dto';
import { UpdateDocumentDto, SearchDocumentsDto } from './dto/Document.dto';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards/JwtAuth.guard';
import { CurrentUser } from 'src/auth/infrastructure/decorators/CurrentUser.decorator';

@ApiTags('documents')
@ApiBearerAuth()
@Controller('documents')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  // --- CARPETAS ---

  @Post('folders')
  async createFolder(@Body() dto: CreateFolderDto, @CurrentUser('uuid') userId?: string) {
    return await this.documentsService.createFolder(dto, userId);
  }

  @Patch('folders/:id')
  async renameFolder(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: RenameFolderDto,
  ) {
    return await this.documentsService.renameFolder(id, dto);
  }

  @Get('folders')
  async getRootContent() {
    return await this.documentsService.getFolderContent();
  }

  @Get('folders/:id')
  async getFolderContent(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.documentsService.getFolderContent(id);
  }

  @Delete('folders/:id')
  async deleteFolder(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.documentsService.deleteFolder(id);
  }

  // --- BÚSQUEDA ---

  @Get('search')
  async search(@Query() searchDto: SearchDocumentsDto) {
    return await this.documentsService.search(searchDto);
  }

  // --- ARCHIVOS / DOCUMENTOS ---

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary' },
        folderId: { type: 'string', format: 'uuid' },
        metadata: { type: 'string', description: 'JSON con metadatos adicionales' },
      },
    },
  })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 50 * 1024 * 1024 }) // 50MB máximo configurable
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Body('folderId') folderId?: string,
    @Body('metadata') metadataRaw?: string,
    @CurrentUser('uuid') userId?: string,
  ) {
    let metadata: Record<string, any> = {};
    if (metadataRaw) {
      try {
        metadata = typeof metadataRaw === 'string' ? JSON.parse(metadataRaw) : metadataRaw;
      } catch {
        metadata = { note: metadataRaw };
      }
    }

    return await this.documentsService.saveUploadedFile(file, folderId, metadata, userId);
  }

  @Get(':id')
  async getDocumentDetails(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.documentsService.getDocumentById(id);
  }

  @Get(':id/view')
  @ApiProduces('application/octet-stream')
  async viewDocument(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Res() res: Response,
  ) {
    const doc = await this.documentsService.getDocumentById(id);
    const { stream } = this.documentsService.getDocumentStream(doc);

    res.set({
      'Content-Type': doc.mimeType,
      'Content-Disposition': `inline; filename="${encodeURIComponent(doc.originalName)}"`,
      'Content-Length': doc.size,
    });

    stream.pipe(res);
  }

  @Get(':id/download')
  @ApiProduces('application/octet-stream')
  async downloadDocument(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Res() res: Response,
  ) {
    const doc = await this.documentsService.getDocumentById(id);
    const { stream } = this.documentsService.getDocumentStream(doc);

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(doc.originalName)}"`,
      'Content-Length': doc.size,
    });

    stream.pipe(res);
  }

  @Patch(':id')
  async updateDocument(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateDocumentDto,
  ) {
    return await this.documentsService.updateDocument(id, dto);
  }

  @Delete(':id')
  async deleteDocument(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.documentsService.deleteDocument(id);
  }
}
