import { IsArray, IsEmail, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum SendMethod {
  MAIL = 'MAIL',
  WHATSAPP = 'WHATSAPP',
}

export class StockClosingReportItemDto {
  Producto: string;
  UnidadMedida: string;
  CantidadRequerida: string;
  CantidadRequeridaFestivo: string;
  Fecha: string;
  CantidadActual: string;
  CantidadPrevia: string;
  ASolicitar: number;
  ASolicitarFestivo: number;
  Revisor: string;
  Tipo: string;
  CheckList: string;
  Entradas: number;
  Diferencia: string;
  Turno: string;
}

export class SendStockClosingReportRequestDto {
  @IsEnum(SendMethod)
  method: SendMethod;

  @IsEmail()
  to: string;

  @IsOptional()
  @IsString()
  cc?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockClosingReportItemDto)
  data: StockClosingReportItemDto[];
}
