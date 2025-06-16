import { IsOptional } from 'class-validator';

export class UpdateStockRequestDto {
    @IsOptional()
    uuid_category: string;
    @IsOptional()
    uuid_product: string;
    @IsOptional()
    uuid_branch: string;
    @IsOptional()
    quantity: number;
    @IsOptional()
    requiredStock: number;
    @IsOptional()
    holidayRequiredStock: number;
}

