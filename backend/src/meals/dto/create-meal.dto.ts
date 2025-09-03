import { IsArray, IsDateString, IsEnum, IsNotEmpty, ValidateNested } from "class-validator"
import { MealType } from "../enum/mealType.enum"
import { MealRecipeDto } from "./mealRecipe.dto"
import { Type } from "class-transformer"

export class CreateMealDto{

    @IsDateString()
    @IsNotEmpty()
    date: Date

    @IsEnum(MealType)
    @IsNotEmpty()
    mealType: MealType

    @IsArray()
    @ValidateNested({each: true})
    @Type(()=>MealRecipeDto)
    @IsNotEmpty()
    recipes: MealRecipeDto[]

}