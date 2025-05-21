import { Expose } from 'class-transformer';

export class BranchDto {
    @Expose()
    name: string;
    @Expose()
    uuid: string;
    @Expose()
    lat: string;
    @Expose()
    lng: string;
    @Expose()
    street: string;
    @Expose()
    neigborhood: string;
    @Expose()
    zip_code: number;
    @Expose()
    internal_number: string;
    @Expose()
    external_number: string;
    @Expose()
    state: string;
    @Expose()
    locality: string;
    @Expose()
    place_id: string;
}
