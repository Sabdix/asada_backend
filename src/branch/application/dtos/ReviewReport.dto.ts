import { Expose } from 'class-transformer';

export class ReviewReportDto {

    @Expose()
    Nombre: string;
    @Expose()
    Comentario: string;
    @Expose()
    Calificacion: number;
    @Expose()
    Sucursal: string;
    @Expose()
    Fecha: Date;

}
