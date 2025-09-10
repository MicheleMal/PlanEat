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
import {
    ApiBearerAuth,
    ApiBody,
    ApiConflictResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
} from "@nestjs/swagger";

@ApiBearerAuth()
@Controller("recipes")
export class RecipesController {
    constructor(private readonly recipesService: RecipesService) {}

    @ApiOperation({
        summary: "Creare nuova ricetta",
    })
    @ApiBody({
        type: CreateRecipeDto,
    })
    @ApiConflictResponse({
        description: "Ricetta già presente con nome inserito",
    })
    @ApiOkResponse({
        description: "Ricetta creata con successo",
        schema: {
            example: {
                id: 21,
                title: "Pasta al pomodoro",
                prepTime: 60,
                user: {
                    id: 2,
                },
            },
        },
    })
    @UseGuards(AuthGuard)
    @Post()
    createRecipe(
        @Body(ValidationPipe) createRecipeDto: CreateRecipeDto,
        @Request() req: Request
    ) {
        return this.recipesService.createRecipe(createRecipeDto, req);
    }

    @ApiOperation({
        summary: "Informazioni di un pasto",
    })
    @ApiParam({
        name: "id",
        description: "Id ricetta da visualizzare",
    })
    @ApiOkResponse({
        description: "Ricetta",
        schema: {
            example: {
                id: 20,
                title: "Pasta con pomodori",
                description: "Pasta con pomdori freschi",
                prepTime: 4,
                recipeIngredient: [
                    {
                        recipeId: 20,
                        ingredientId: 12,
                        quantity: 100,
                        unit: "g",
                        ingredient: {
                            id: 12,
                            name: "Pomodori pelati",
                        },
                    },
                ],
            },
        },
    })
    @UseGuards(AuthGuard)
    @Get("/:id")
    getRecipeById(@Request() req: Request, @Param("id") id?: number) {
        return this.recipesService.getRecipeById(req, id);
    }

    @ApiOperation({
        summary: "Elenco di tutti i pasti o solo ricerca per titolo",
    })
    @ApiQuery({
        name: "title",
        required: false,
    })
    @ApiOkResponse({
        description: "Elenco di tutte le ricette create o cercate con il nome",
        schema: {
            example: {
                id: 20,
                title: "Pasta con pomodori",
                description: "Pasta con pomdori freschi",
                prepTime: 4,
                recipeIngredient: [
                    {
                        recipeId: 20,
                        ingredientId: 12,
                        quantity: 100,
                        unit: "g",
                        ingredient: {
                            id: 12,
                            name: "Pomodori pelati",
                        },
                    },
                ],
            },
        },
    })
    @UseGuards(AuthGuard)
    @Get()
    getAllRecipes(@Request() req: Request, @Query("title") title?: string) {
        return this.recipesService.getRecipes(req, title);
    }

    @ApiOperation({
        summary: `
        Modifica ricetta in quattro modi:
        \n1) L'utente può modificare: title, description, prepTime,
        \n2) Modificare ingredienti (quantity, unit) associato alla ricetta
        \n3) Aggiungere un nuovo ingrediente alla ricetta
        \n4) Eliminare un ingrediente associato alla ricetta, inserendo delete true come campo 
        `,
    })
    @ApiParam({
        name: "id",
        description: "Id ricetta da modificare",
    })
    @ApiBody({
        type: UpdateRecipeDto,
        description: "Modifica ricetta",
    })
    @ApiOkResponse({
        description: "Ricetta modificat",
        schema: {
            example: {
                id: 20,
                title: "Pasta con pomodori",
                description: "Pasta con pomdori freschi",
                prepTime: 4,
                recipeIngredient: [
                    {
                        recipeId: 20,
                        ingredientId: 12,
                        quantity: 100,
                        unit: "g",
                        ingredient: {
                            id: 12,
                            name: "Pomodori pelati",
                        },
                    },
                ],
            },
        },
    })
    @UseGuards(AuthGuard)
    @Patch("/:id")
    updateRecipe(
        @Request() req: Request,
        @Body(ValidationPipe) updateRecipeDto: UpdateRecipeDto,
        @Param("id", ParseIntPipe) id: number
    ) {
        return this.recipesService.updateRecipe(req, updateRecipeDto, id);
    }

    @ApiOperation({
        summary: "Elimina ricetta"
    })
    @ApiParam({
        name: "id",
        description: "Id ricetta da eliminare",
    })
    @ApiOkResponse({
        description: "Ricetta eliminata",
    })
    @UseGuards(AuthGuard)
    @Delete("/:id")
    deleteRecipe(@Request() req: Request, @Param("id") id: number) {
        return this.recipesService.deleteRecipe(req, id);
    }
}
