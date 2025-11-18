import { Expose, Type } from 'class-transformer';
import { SimpleStockDto } from './SimpleStock.dto';

export class StocHistorykDto {
    @Expose()
    uuid: string;

    @Expose()
    quantity: number

    @Expose()
    previousQuantity: number

    @Expose()
    type: string

    @Expose()
    date: Date

    @Expose()
    @Type(() => SimpleStockDto)
    stock?: SimpleStockDto;
}
