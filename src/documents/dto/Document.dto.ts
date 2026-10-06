import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  originalName?: string;

  @IsOptional()
  @IsUUID('4')
  folderId?: string | null;

  @IsOptional()
  metadata?: Record<string, any>;
}

export class SearchDocumentsDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsUUID('4')
  folderId?: string;

  @IsOptional()
  @IsString()
  mimeType?: string;
}
