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

@Controller("meals")
export class MealsController {
    constructor(private readonly mealsService: MealsService) {}

    @UseGuards(AuthGuard)
    @Post()
    createMeal(
        @Request() req: Request,
        @Body(ValidationPipe) createMealDto: CreateMealDto
    ) {
        return this.mealsService.createMeal(req, createMealDto);
    }

    @UseGuards(AuthGuard)
    @Get()
    getAllMeals(
        @Request() req: Request,
        @Query('startDate') startDate: Date,
        @Query('endDate') endDate: Date,
    ) {
        return this.mealsService.getAllMeals(req, startDate, endDate);
    }

    @UseGuards(AuthGuard)
    @Get("/:id")
    getMealById(
        @Request() req: Request,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.mealsService.getMealById(req, id);
    }

    @UseGuards(AuthGuard)
    @Patch("/:id")
    updateMeal(
        @Request() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body(ValidationPipe) updateMealDto: UpdateMealDto
    ) {
        return this.mealsService.updateMeal(req, id, updateMealDto);
    }

    @UseGuards(AuthGuard)
    @Delete("/:id")
    deleteMeal(
        @Request() req: Request,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.mealsService.deleteMeal(req, id);
    }


}
