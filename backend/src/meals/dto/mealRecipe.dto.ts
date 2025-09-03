import { IsNotEmpty, IsNumber } from "class-validator";

export class MealRecipeDto{

    @IsNumber()
    @IsNotEmpty() 
    id: number

}