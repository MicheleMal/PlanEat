import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { Unit } from "../enums/unit.enum";

export class RecipeIngredientDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @Min(1, {
        message: "Puoi inserire una quantità maggiore di 0",
    })
    quantity: number;

    @IsEnum(Unit)
    @IsNotEmpty()
    unit: Unit;
}
