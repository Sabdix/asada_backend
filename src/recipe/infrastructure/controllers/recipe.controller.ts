import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
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
import { GetRecipePdfQuery } from "src/recipe/application/queries/GetRecipePdf/GetRecipePdf.query";
import { GetRecipesQuery } from "src/recipe/application/queries/GetRecipes/GetRecipes.query";
import { GetRecipeVideoQuery } from "src/recipe/application/queries/GetRecipeVideo/GetRecipeVideo.query";



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

    // @Post('create')
    // @UseInterceptors(
    //     FileFieldsInterceptor(
    //         [
    //             {
    //                 name: 'pdfFile',
    //                 maxCount: 1,
    //             },
    //             {
    //                 name: 'videoFile',
    //                 maxCount: 1,
    //             },
    //         ],
    //         {
    //             storage: diskStorage({
    //                 destination: (req, file, cb) => {
    //                     if (file.fieldname === 'pdfFile') {
    //                         cb(null, './media/recipe/pdfs');
    //                     } else if (file.fieldname === 'videoFile') {
    //                         cb(null, './media/recipe/videos');
    //                     } else {
    //                         cb(new Error('Campo de archivo no reconocido'), "");
    //                     }
    //                 },
    //                 filename: (req, file, cb) => {
    //                     return cb(null, file.originalname);
    //                 },
    //             }),
    //             fileFilter: (req, file, cb) => {
    //                 if (file.fieldname === 'pdfFile') {
    //                     if (!file.originalname.match(/\.(pdf)$/)) {
    //                         return cb(new Error('Solo se permiten archivos PDF'), false);
    //                     }
    //                 } else if (file.fieldname === 'videoFile') {
    //                     if (!file.originalname.match(/\.(mp4|mov|avi|wmv|flv|webm)$/i)) {
    //                         return cb(new Error('Solo se permiten archivos de video (mp4, mov, avi, etc.)'), false);
    //                     }
    //                 }
    //                 cb(null, true);
    //             },
    //             limits: {
    //                 fileSize: 100 * 1024 * 1024,
    //             },
    //         },
    //     ),
    // )
    // async createRecipe(
    //     @Body() createRecipeRequestDto: CreateRecipeRequestDto,
    //     @UploadedFiles() files: Record<string, Express.Multer.File[]>,
    // ) {
    //     const pdfFile = files.pdfFile ? files.pdfFile[0] : null;
    //     const videoFile = files.videoFile ? files.videoFile[0] : null;

    //     if (!pdfFile) {
    //         return WsResponse.buildBadRequestResponse('PDF file is required.');
    //     }
    //     if (!videoFile) {
    //         return WsResponse.buildBadRequestResponse('Video file is required.');
    //     }
    //     return this.commandBus.execute(
    //         new CreateRecipeCommand(
    //             createRecipeRequestDto,
    //             pdfFile.filename,
    //             videoFile.filename,
    //         ),
    //     );
    // }

    @Post('create')
    @UseInterceptors(
        FileInterceptor('pdfFile', {
            storage: diskStorage({
                destination: './media/recipe/pdfs',
                filename: (req, pdfFile, cb) => {
                    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                    return cb(null, pdfFile.originalname);

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
    async createRecipe(@Body() createRecipeRequestDto: CreateRecipeRequestDto, @UploadedFile() pdfFile: Express.Multer.File) {
        if (!pdfFile) {
            return WsResponse.buildBadRequestResponse('pdfFile is requiered');
        }

        return this.commandBus.execute(new CreateRecipeCommand(createRecipeRequestDto, pdfFile.filename));
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

    // @Put(':uuid')
    // @UseInterceptors(
    //     FileFieldsInterceptor(
    //         [
    //             {
    //                 name: 'pdfFile',
    //                 maxCount: 1,
    //             },
    //             {
    //                 name: 'videoFile',
    //                 maxCount: 1,
    //             },
    //         ],
    //         {
    //             storage: diskStorage({
    //                 destination: (req, file, cb) => {
    //                     if (file.fieldname === 'pdfFile') {
    //                         cb(null, './media/recipe/pdfs');
    //                     } else if (file.fieldname === 'videoFile') {
    //                         cb(null, './media/recipe/videos');
    //                     } else {
    //                         cb(new Error('Campo de archivo no reconocido'), "");
    //                     }
    //                 },
    //                 filename: (req, file, cb) => {
    //                     return cb(null, file.originalname);
    //                 },
    //             }),
    //             fileFilter: (req, file, cb) => {
    //                 if (file.fieldname === 'pdfFile') {
    //                     if (!file.originalname.match(/\.(pdf)$/)) {
    //                         return cb(new Error('Solo se permiten archivos PDF'), false);
    //                     }
    //                 } else if (file.fieldname === 'videoFile') {
    //                     if (!file.originalname.match(/\.(mp4|mov|avi|wmv|flv|webm)$/i)) {
    //                         return cb(new Error('Solo se permiten archivos de video (mp4, mov, avi, etc.)'), false);
    //                     }
    //                 }
    //                 cb(null, true);
    //             },
    //             limits: {
    //                 fileSize: 100 * 1024 * 1024,
    //             },
    //         },
    //     ),
    // )
    // async UpdateRecipe(@Param('uuid') uuid: string, @Body() request: UpdateRecipeCategoryRequestDto, @UploadedFiles() files: Record<string, Express.Multer.File[]>,) {
    //     const updatePdfName = !!files.pdfFile
    //     const updateVideoName = !!files.videoFile

    //     const pdfFileName = files.pdfFile ? files.pdfFile[0].filename : "";
    //     const videoFileName = files.videoFile ? files.videoFile[0].filename : "";


    //     return this.commandBus.execute(new UpdateRecipeCommand(request, uuid, pdfFileName, updatePdfName, videoFileName, updateVideoName));
    // }

    @Put(':uuid')
    @UseInterceptors(
        FileInterceptor('pdfFile', {
            storage: diskStorage({
                destination: './media/recipe/pdfs',
                filename: (req, PdfFile, cb) => {
                    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                    return cb(null, PdfFile.originalname);

                },
            }),
            fileFilter: (req, PdfFile, cb) => {
                if (!PdfFile.originalname.match(/\.(pdf)$/)) {
                    return cb(new Error('Solo se permiten archivos PDF'), false);
                }
                cb(null, true);
            },
            limits: {
                fileSize: 10 * 1024 * 1024, // Limite de 10 MB
            },
        }),
    )
    async UpdateRecipe(@Param('uuid') uuid: string, @Body() request: UpdateRecipeCategoryRequestDto, @UploadedFile() pdfFile: Express.Multer.File) {

        const updateFile = !!pdfFile

        const filename = pdfFile ? pdfFile.filename : "";

        return this.commandBus.execute(new UpdateRecipeCommand(request, uuid, filename, updateFile));
    }

    @Get('video/:uuid')
    async getRecipeVideo(@Param('uuid') uuid: string) {
        return this.queryBus.execute(new GetRecipeVideoQuery(uuid));
    }

    @Get('pdf/:uuid')
    async getRecipePdf(@Param('uuid') uuid: string) {
        return this.queryBus.execute(new GetRecipePdfQuery(uuid));
    }
}
