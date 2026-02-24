import { Controller, Get, Query } from "@nestjs/common";
import { IngredientsService } from "../service/ingredients.service";
import { ApiOkResponse, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { Ingredient } from "../entity/ingredient.entity";

@Controller("ingredients")
export class IngredientsController {
    constructor(private readonly ingredientsService: IngredientsService) {}

    @ApiOperation({
        summary: "Cercare ingrediente per nome",
    })
    @ApiQuery({
        name: "search",
        required: true,
        description: "Serve per cercare il nome di un ingrediente",
    })
    @ApiOkResponse({
        description: "Lista ingredienti",
    })
    @Get()
    getIngredients(@Query("search") name: string): Promise<Ingredient[]> {
        return this.ingredientsService.getIngredients(name);
    }
}
