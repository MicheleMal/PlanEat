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
import { MealsService } from "../service/meals.service";
import { CreateMealDto } from "../dto/create-meal.dto";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { UpdateMealDto } from "../dto/update-meal.dto";
import {
    ApiBearerAuth,
    ApiBody,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
} from "@nestjs/swagger";
import { MealType } from "../enum/mealType.enum";

@ApiBearerAuth()
@Controller("meals")
export class MealsController {
    constructor(private readonly mealsService: MealsService) {}

    @ApiOperation({
        summary: "Creare nuovo pasto",
    })
    @ApiBody({ type: CreateMealDto })
    @ApiOkResponse({
        description: "Pasto creato con successo",
        example: {
            id: 15,
            date: "2025-09-12",
            mealType: MealType.PRANZO,
            user: {
                id: 2,
            },
            createdAt: "2025-09-10T17:05:13.652Z",
            updateAt: "2025-09-10T17:05:13.652Z",
        },
    })
    @UseGuards(AuthGuard)
    @Post()
    createMeal(
        @Request() req: Request,
        @Body(ValidationPipe) createMealDto: CreateMealDto
    ) {
        return this.mealsService.createMeal(req, createMealDto);
    }

    @ApiOperation({
        summary: "Lista di tutti i pasti o solo per range di date",
    })
    @ApiQuery({
        name: "startDate",
        description: "Date inizio range",
    })
    @ApiQuery({
        name: "endDate",
        description: "Date fine range",
    })
    @ApiOkResponse({
        description: "Pasto",
        example: {
            id: 12,
            date: "2025-09-11",
            mealType: "Pranzo",
            createdAt: "2025-09-10T10:07:04.000Z",
            updateAt: "2025-09-10T10:07:04.000Z",
            mealRecipe: [
                {
                    mealId: 12,
                    recipeId: 19,
                    recipe: {
                        id: 19,
                        title: "Spaghetti al pomodoro",
                        description: "Spaghetti al pomodoro",
                        prepTime: 10,
                    },
                },
            ],
        },
    })
    @UseGuards(AuthGuard)
    @Get()
    getAllMeals(
        @Request() req: Request,
        @Query("startDate") startDate: Date,
        @Query("endDate") endDate: Date
    ) {
        return this.mealsService.getAllMeals(req, startDate, endDate);
    }

    @ApiOperation({
        summary: "Informazioni di un pasto",
    })
    @ApiParam({
        name: "id",
        description: "Id pasto",
    })
    @ApiOkResponse({
        description: "Pasto",
        example: {
            id: 12,
            date: "2025-09-11",
            mealType: "Pranzo",
            createdAt: "2025-09-10T10:07:04.000Z",
            updateAt: "2025-09-10T10:07:04.000Z",
            mealRecipe: [
                {
                    mealId: 12,
                    recipeId: 19,
                    recipe: {
                        id: 19,
                        title: "Spaghetti al pomodoro",
                        description: "Spaghetti al pomodoro",
                        prepTime: 10,
                    },
                },
            ],
        },
    })
    @UseGuards(AuthGuard)
    @Get("/:id")
    getMealById(
        @Request() req: Request,
        @Param("id", ParseIntPipe) id: number
    ) {
        return this.mealsService.getMealById(req, id);
    }

    @ApiOperation({
        summary: "Modifica di un pasto",
    })
    @ApiParam({
        name: "id",
        description: "Id pasto da modificare",
    })
    @ApiBody({ type: UpdateMealDto })
    @ApiOkResponse({
        description: "Pasto modificato con successo",
        example: {
            id: 12,
            date: "2025-09-11",
            mealType: "Pranzo",
            createdAt: "2025-09-10T10:07:04.000Z",
            updateAt: "2025-09-10T10:07:04.000Z",
            mealRecipe: [
                {
                    mealId: 12,
                    recipeId: 19,
                    recipe: {
                        id: 19,
                        title: "Spaghetti al pomodoro",
                        description: "Spaghetti al pomodoro",
                        prepTime: 10,
                    },
                },
            ],
        },
    })
    @UseGuards(AuthGuard)
    @Patch("/:id")
    updateMeal(
        @Request() req: Request,
        @Param("id", ParseIntPipe) id: number,
        @Body(ValidationPipe) updateMealDto: UpdateMealDto
    ) {
        return this.mealsService.updateMeal(req, id, updateMealDto);
    }

    @ApiOperation({
        summary: "Elimina di un pasto",
    })
    @ApiParam({
        name: "id",
        description: "Id pasto da eliminare",
    })
    @ApiNoContentResponse({
        description: "Pasto eliminato con successo",
    })
    @UseGuards(AuthGuard)
    @Delete("/:id")
    deleteMeal(@Request() req: Request, @Param("id", ParseIntPipe) id: number) {
        return this.mealsService.deleteMeal(req, id);
    }
}
