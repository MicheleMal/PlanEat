import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
} from "class-validator";
import { RecipeIngredientDto } from "./recipeIngredient.dto";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { Unit } from "../enums/unit.enum";

export class CreateRecipeDto {
    @ApiProperty({
        type: "string",
        name: "title",
        description: "Titolo ricetta",
        example: "Pasta con pomodori",
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        type: "string",
        name: "description",
        description: "Descrizione ricetta",
        example: "Pasta con pomodori freschi",
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        type: "number",
        name: "prepTime",
        description: "tempo di preparazione in minuti",
        example: 30,
    })
    @IsNumber()
    @IsNotEmpty()
    prepTime: number;

    @ApiProperty({
        type: ()=>[RecipeIngredientDto],
        isArray: true,
        name: "ingredients",
        description: "Lista ingredienti presenti nella ricetta",
        example: [
            {name: "Pomodoro", quantity: 20, unit: Unit.PZ},
            {name: "Sale", quantity: 5, unit: Unit.G}
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RecipeIngredientDto)
    @IsNotEmpty()
    ingredients: RecipeIngredientDto[];
}
