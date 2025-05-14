import { Expose } from 'class-transformer';

export class CheckListHistoryReportDto {

    @Expose()
    Lista: string;
    @Expose()
    Empleado: string;
    @Expose()
    Sucursal: string;
    @Expose()
    Dia: string;
    @Expose()
    HoraInicio: string;
    @Expose()
    HoraFin: string;
    @Expose()
    Fecha: string;
    @Expose()
    Estado: string;

}
