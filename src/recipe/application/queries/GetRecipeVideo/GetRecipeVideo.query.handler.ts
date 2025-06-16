import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import * as fs from 'fs/promises';
import { RecipeService } from '../../services/Recipe.service';
import { join } from 'path';
import { GetRecipeVideoQuery } from './GetRecipeVideo.query';

@QueryHandler(GetRecipeVideoQuery)
export class GetRecipeVideoQueryHandler implements IQueryHandler<GetRecipeVideoQuery> {
    constructor(
        private recipeService: RecipeService
    ) { }

    async execute(query: GetRecipeVideoQuery): Promise<WsResponse<string | Buffer>> {
        try {

            const recipe = await this.recipeService.getRecipeByUuid(query.uuid);
            if (!recipe) return WsResponse.buildNotFoundResponse('RECIPE NOT FOUND');

            let filePath: string;

            filePath = join('./media/recipe/videos', recipe.video);
            const fileBuffer = await fs.readFile(filePath);

            return WsResponse.buildOkResponse(fileBuffer);
        } catch (error) {
            console.error('Error al generar el video:', error);
            return WsResponse.buildErrorResponse(1, 'Error al generar el video.', error);
        }
    }
}
