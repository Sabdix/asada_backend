import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateRecipeCategoryCommand } from "src/recipe/application/commands/CreateRecipeCategory/CreateRecipeCategory.command";
import { DeleteRecipeCategoryCommand } from "src/recipe/application/commands/DeleteRecipeCategory/DeleteCategory.command";
import { UpdateRecipeCategoryCommand } from "src/recipe/application/commands/UpdateRecipeCategory/UpdateRecipeCategory.command";
import { CreateRecipeCategoryRequestDto } from "src/recipe/application/dtos/CreateRecipeCategoryRequest.dto";
import { UpdateRecipeCategoryRequestDto } from "src/recipe/application/dtos/UpdateRecupeCategory.dto";
import { GetRecipeCategoriesQuery } from "src/recipe/application/queries/GetRecipeCategories/GetRecipeCategories.query";
import { GetRecipeCategoryByUuidQuery } from "src/recipe/application/queries/GetRecipeCategoryByUuid/GetRecipeCategoryByUuid.query";



@Controller('recipe')
export class recipeController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) { }

    // @Post('create')
    // async createBranch(@Body() createBranchRequestDto: CreateBranchRequestDto) {
    //     return this.commandBus.execute(new CreateBranchCommand(createBranchRequestDto));
    // }

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
    async deleteBranch(@Param('uuid') uuid: string) {
        return this.commandBus.execute(new DeleteRecipeCategoryCommand(uuid));
    }

    @Put('category/:uuid')
    async UpdateBranch(@Param('uuid') uuid: string, @Body() request: UpdateRecipeCategoryRequestDto) {
        return this.commandBus.execute(new UpdateRecipeCategoryCommand(request, uuid));
    }

}
