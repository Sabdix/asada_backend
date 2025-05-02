import { Expose, Type } from "class-transformer";
import { CriteriaDto } from "./Criteria.dto";

export class AnswerDto {
    @Expose()
    text: string;

    @Expose()
    uuid: string;

    @Expose()
    requieres_action: boolean;

    @Expose()
    @Type(() => CriteriaDto)
    checkListItemCriteria?: CriteriaDto;
}