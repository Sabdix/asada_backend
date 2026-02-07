import { Expose } from 'class-transformer';

export class StockHistoryReportDto {

    @Expose()
    Producto: string;
    @Expose()
    UnidadMedida: string;
    @Expose()
    CantidadRequerida: string;
    @Expose()
    CantidadRequeridaFestivo: string;
    @Expose()
    Fecha: string;
    @Expose()
    CantidadActual: string;
    @Expose()
    CantidadPrevia: string;
    @Expose()
    ASolicitar: number;
    @Expose()
    ASolicitarFestivo: number;
    @Expose()
    Revisor: string;
    @Expose()
    Tipo: string;
    @Expose()
    CheckList: string;
}
