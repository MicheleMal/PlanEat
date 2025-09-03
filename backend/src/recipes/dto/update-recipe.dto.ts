import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { UpdateRecipeIngredientDto } from "./update-recipeIngredient.dto";

export class UpdateRecipeDto{

    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    prepTime?: number;
    
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateRecipeIngredientDto)
    ingredients?: UpdateRecipeIngredientDto[];
}
