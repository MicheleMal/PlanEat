import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { Unit } from "../enums/unit.enum";
import { ApiProperty } from "@nestjs/swagger";

export class RecipeIngredientDto {
    @ApiProperty({
        type: "string",
        name: "name",
        description: "Nome ingrediente",
        example: "Pomodoro",
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        type: "number",
        name: "quantity",
        description: "Quantità ingrediente presente nella ricetta",
        example: "12",
    })
    @IsNumber()
    @Min(1, {
        message: "Puoi inserire una quantità maggiore di 0",
    })
    quantity: number;

    @ApiProperty({
        enum: Unit,
        enumName: "unit",
        description: "Unità del prodotto presente nella ricetta. Es. g, kg, l, pz, ecc...",
        example: Unit.PZ
    })
    @IsEnum(Unit)
    @IsNotEmpty()
    unit: Unit;
}
