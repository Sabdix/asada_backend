import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

export class CreateStockEntranceRequestDto {
    @IsNotEmpty()
    uuid_branch: string;
    @IsNotEmpty()
    uuid_user: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StocksDto)
    stocks: StocksDto[];
}

export class StocksDto {
    @IsNotEmpty()
    uuid_stock: string;

    @IsNotEmpty()
    quantity: number;
}
