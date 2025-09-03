import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Request,
    UseGuards,
    ValidationPipe,
} from "@nestjs/common";
import { RecipesService } from "../service/recipes.service";
import { CreateRecipeDto } from "../dto/create-recipe.dto";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { UpdateRecipeDto } from "../dto/update-recipe.dto";

@Controller("recipes")
export class RecipesController {
    constructor(private readonly recipesService: RecipesService) {}

    @UseGuards(AuthGuard)
    @Post()
    createRecipe(
        @Body(ValidationPipe) createRecipeDto: CreateRecipeDto,
        @Request() req: Request
    ) {
        return this.recipesService.createRecipe(createRecipeDto, req);
    }

    @UseGuards(AuthGuard)
    @Get("/:id")
    getRecipeById(@Request() req: Request, @Param("id") id?: number) {
        return this.recipesService.getRecipeById(req, id);
    }

    @UseGuards(AuthGuard)
    @Get()
    getAllRecipes(@Request() req: Request, @Query('title') title?: string) {
        return this.recipesService.getRecipes(req, title);
    }

    @UseGuards(AuthGuard)
    @Patch("/:id")
    updateRecipe(
        @Request() req: Request,
        @Body(ValidationPipe) updateRecipeDto: UpdateRecipeDto,
        @Param("id", ParseIntPipe) id: number
    ) {
        return this.recipesService.updateRecipe(req, updateRecipeDto, id);
    }

    @UseGuards(AuthGuard)
    @Delete("/:id")
    deleteRecipe(@Request() req: Request, @Param("id") id: number) {
        return this.recipesService.deleteRecipe(req, id);
    }
}
