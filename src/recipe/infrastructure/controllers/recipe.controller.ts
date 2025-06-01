import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { WsResponse } from "src/common/dtos/WsResponse.dto";
import { CreateRecipeCommand } from "src/recipe/application/commands/CreateRecipe/CreateRecipe.command";
import { CreateRecipeCategoryCommand } from "src/recipe/application/commands/CreateRecipeCategory/CreateRecipeCategory.command";
import { DeleteRecipeCommand } from "src/recipe/application/commands/DeleteRecipe/DeleteRecipe.command";
import { DeleteRecipeCategoryCommand } from "src/recipe/application/commands/DeleteRecipeCategory/DeleteCategory.command";
import { UpdateRecipeCommand } from "src/recipe/application/commands/UpdateRecipe/UpdateRecipe.command";
import { UpdateRecipeCategoryCommand } from "src/recipe/application/commands/UpdateRecipeCategory/UpdateRecipeCategory.command";
import { CreateRecipeCategoryRequestDto } from "src/recipe/application/dtos/CreateRecipeCategoryRequest.dto";
import { CreateRecipeRequestDto } from "src/recipe/application/dtos/CreateRecipeRequest.dto";
import { UpdateRecipeCategoryRequestDto } from "src/recipe/application/dtos/UpdateRecipeCategory.dto";
import { GetRecipeByUuidQuery } from "src/recipe/application/queries/GetRecipeByUuid/GetRecipeByUuid.query";
import { GetRecipeCategoriesQuery } from "src/recipe/application/queries/GetRecipeCategories/GetRecipeCategories.query";
import { GetRecipeCategoryByUuidQuery } from "src/recipe/application/queries/GetRecipeCategoryByUuid/GetRecipeCategoryByUuid.query";
import { GetRecipesQuery } from "src/recipe/application/queries/GetRecipes/GetRecipes.query";



@Controller('recipe')
export class recipeController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) { }

    @Post('category/create')
    async createRecipeCategory(@Body() createRecipeCategoryRequestDto: CreateRecipeCategoryRequestDto) {
        return this.commandBus.execute(new CreateRecipeCategoryCommand(createRecipeCategoryRequestDto));
    }

    @Get('category/:uuid')
    async getRecipeCategoryByUuid(@Param('uuid') uuid: string) {
        return this.queryBus.execute(new GetRecipeCategoryByUuidQuery(uuid));
    }

    @Get('categories')
    async getRecipeCategories() {
        return this.queryBus.execute(new GetRecipeCategoriesQuery());
    }

    @Delete('category/:uuid')
    async deleteRecipeCategory(@Param('uuid') uuid: string) {
        return this.commandBus.execute(new DeleteRecipeCategoryCommand(uuid));
    }

    @Put('category/:uuid')
    async UpdateRecipeCategory(@Param('uuid') uuid: string, @Body() request: UpdateRecipeCategoryRequestDto) {
        return this.commandBus.execute(new UpdateRecipeCategoryCommand(request, uuid));
    }

    @Post('create')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './media/recipe/pdfs',
                filename: (req, file, cb) => {
                    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (!file.originalname.match(/\.(pdf)$/)) {
                    return cb(new Error('Solo se permiten archivos PDF'), false);
                }
                cb(null, true);
            },
            limits: {
                fileSize: 10 * 1024 * 1024, // Limite de 10 MB
            },
        }),
    )
    async createRecipe(@Body() createRecipeRequestDto: CreateRecipeRequestDto, @UploadedFile() file: Express.Multer.File) {
        if (!file) {
            return WsResponse.buildBadRequestResponse('File is requiered');
        }

        return this.commandBus.execute(new CreateRecipeCommand(createRecipeRequestDto, file.path));
    }

    @Get('')
    async getRecipes() {
        return this.queryBus.execute(new GetRecipesQuery());
    }

    @Get('by-uuid/:uuid')
    async getRecipeByUuid(@Param('uuid') uuid: string) {
        return this.queryBus.execute(new GetRecipeByUuidQuery(uuid));
    }

    @Delete(':uuid')
    async deleteRecipe(@Param('uuid') uuid: string) {
        return this.commandBus.execute(new DeleteRecipeCommand(uuid));
    }

    @Put(':uuid')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './media/recipe/pdfs',
                filename: (req, file, cb) => {
                    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (!file.originalname.match(/\.(pdf)$/)) {
                    return cb(new Error('Solo se permiten archivos PDF'), false);
                }
                cb(null, true);
            },
            limits: {
                fileSize: 10 * 1024 * 1024, // Limite de 10 MB
            },
        }),
    )
    async UpdateRecipe(@Param('uuid') uuid: string, @Body() request: UpdateRecipeCategoryRequestDto, @UploadedFile() file: Express.Multer.File) {
        
        const updateFile = !!file

        const filePath = file ? file.path : "";

        return this.commandBus.execute(new UpdateRecipeCommand(request, uuid, filePath, updateFile));
    }
}
