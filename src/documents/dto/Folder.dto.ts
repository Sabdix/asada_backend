import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateFolderDto {
  @IsNotEmpty({ message: 'El nombre de la carpeta es requerido' })
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsUUID('4', { message: 'El parentId debe ser un UUID v4 válido' })
  parentId?: string;
}

export class RenameFolderDto {
  @IsNotEmpty({ message: 'El nuevo nombre es requerido' })
  @IsString()
  @MaxLength(255)
  name: string;
}
