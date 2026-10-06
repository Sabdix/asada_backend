import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Document } from './entities/Document.entity';
import { Folder } from './entities/Folder.entity';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards/JwtAuth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Document, Folder])],
  controllers: [DocumentsController],
  providers: [DocumentsService, JwtAuthGuard],
  exports: [DocumentsService],
})
export class DocumentsModule {}
