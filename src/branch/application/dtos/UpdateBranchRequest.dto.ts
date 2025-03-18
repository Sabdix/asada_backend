import { IsOptional } from 'class-validator';

export class UpdateBranchRequestDto {
  @IsOptional()
  name: string;
  @IsOptional()
  lat: number;
  @IsOptional()
  lng: number;
  @IsOptional()
  street: string;
  @IsOptional()
  neigborhood: string;
  @IsOptional()
  zip_code: number;
  @IsOptional()
  internal_number: string;
  @IsOptional()
  external_number: string;
  @IsOptional()
  state: string;
  @IsOptional()
  locality: string;
}

