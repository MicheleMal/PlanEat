import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Unit } from "../enums/unit.enum";

export class UpdateRecipeIngredientDto {

    @IsOptional()
    @IsString()
    name?: string;


    @IsOptional()
    @IsNumber()
    quantity?: number;

    @IsOptional()
    @IsEnum(Unit)
    unit?: Unit;

    @IsOptional()
    @IsNumber()
    ingredientId?: number;

    @IsOptional()
    @IsBoolean()
    delete?: false;

}
