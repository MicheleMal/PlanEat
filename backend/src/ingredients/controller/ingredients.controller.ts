import { Controller, Get, Query } from "@nestjs/common";
import { IngredientsService } from "../service/ingredients.service";

@Controller("ingredients")
export class IngredientsController {
    constructor(private readonly ingredientsService: IngredientsService) {}

    @Get()
    getIngredients(@Query("search") name: string) {
        return this.ingredientsService.getIngredients(name);
    }
}
