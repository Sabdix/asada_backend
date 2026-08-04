import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { StockClosingReportItemDto } from './SendStockClosingReportRequest.dto';

export class SaveStockClosingRequestDto {
  @IsOptional()
  @IsString()
  branchId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockClosingReportItemDto)
  data: StockClosingReportItemDto[];
}
