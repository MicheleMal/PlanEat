import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { RecipeIngredientDto } from "./recipeIngredient.dto";
import { Type } from "class-transformer";

export class CreateRecipeDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    prepTime: number;

    @IsArray()
    @ValidateNested({each: true})
    @Type(()=>RecipeIngredientDto)
    @IsNotEmpty()
    ingredients: RecipeIngredientDto[];
}
