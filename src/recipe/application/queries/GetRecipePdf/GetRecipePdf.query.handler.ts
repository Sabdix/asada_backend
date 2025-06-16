import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import * as fs from 'fs/promises';
import { GetRecipePdfQuery } from './GetRecipePdf.query';
import { RecipeService } from '../../services/Recipe.service';
import { join } from 'path';

@QueryHandler(GetRecipePdfQuery)
export class GetRecipePdfQueryHandler implements IQueryHandler<GetRecipePdfQuery> {
    constructor(
        private recipeService: RecipeService
    ) { }

    async execute(query: GetRecipePdfQuery): Promise<WsResponse<string | Buffer>> {
        try {

            const recipe = await this.recipeService.getRecipeByUuid(query.uuid);
            if (!recipe) return WsResponse.buildNotFoundResponse('RECIPE NOT FOUND');

            let filePath: string;

            filePath = join('./media/recipe/pdfs', recipe.pdf);
            const fileBuffer = await fs.readFile(filePath);

            return WsResponse.buildOkResponse(fileBuffer);
        } catch (error) {
            console.error('Error al generar el pdf:', error);
            return WsResponse.buildErrorResponse(1, 'Error al generar pdf.', error);
        }
    }
}
