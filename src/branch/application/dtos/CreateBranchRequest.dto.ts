import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBranchRequestDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  lat: number;
  @IsNotEmpty()
  lng: number;
  @IsNotEmpty()
  street: string;
  @IsNotEmpty()
  neigborhood: string;
  @IsNotEmpty()
  zip_code: number;
  @IsOptional()
  internal_number: string;
  @IsNotEmpty()
  external_number: string;
  @IsNotEmpty()
  state: string;
  @IsNotEmpty()
  locality: string;
  @IsNotEmpty()
  place_id: string;
}

