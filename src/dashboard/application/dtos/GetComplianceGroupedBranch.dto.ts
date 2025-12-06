import { IsDateString, IsOptional, IsUUID } from "class-validator";

export class GetComplianceGroupedBranchDto {
  @IsDateString()
  dateInit: string;

  @IsDateString()
  dateEnd: string;

  @IsOptional()
  @IsUUID()
  uuidChecklist?: string;
}