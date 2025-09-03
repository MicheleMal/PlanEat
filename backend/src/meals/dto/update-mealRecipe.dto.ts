import { PartialType } from "@nestjs/mapped-types";
import { MealRecipeDto } from "./mealRecipe.dto";

export class UpdateMealRecipeDto extends PartialType(MealRecipeDto){

    /*@IsOptional()
    @IsNumber()
    id?: number

    @IsOptional()
    @IsBoolean()
    delete?: boolean*/

}