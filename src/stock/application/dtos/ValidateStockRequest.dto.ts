import { IsNotEmpty } from 'class-validator';
import { ValidateStockDto } from './ValidateStock.dto';
import { StockHistoryType } from 'src/stock/domain/enums/StockHistoryType.enum';

export class ValidateStockRequestDto {
    @IsNotEmpty()
    stocks: ValidateStockDto[];
    @IsNotEmpty()
    type: StockHistoryType;
    @IsNotEmpty()
    uuid_user: string;
}

