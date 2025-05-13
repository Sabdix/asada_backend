import { Expose, Type } from 'class-transformer';
import { UserBranchDto } from 'src/user/application/dtos/UserBranch.dto';

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
