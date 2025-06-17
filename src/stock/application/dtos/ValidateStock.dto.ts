import { IsNotEmpty } from 'class-validator';

export class ValidateStockDto {
    @IsNotEmpty()
    uuid_stock: string;

    @IsNotEmpty()
    quantity: number;
}

