import { IsNotEmpty } from 'class-validator';

export class CreateStockRequestDto {
    @IsNotEmpty()
    uuid_category: string;
    @IsNotEmpty()
    uuid_product: string;
    @IsNotEmpty()
    uuid_branch: string;
    @IsNotEmpty()
    quantity: number;
    @IsNotEmpty()
    requiredStock: number;
    @IsNotEmpty()
    holidayRequiredStock: number;
}

