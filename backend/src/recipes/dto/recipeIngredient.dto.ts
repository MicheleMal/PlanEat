import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Unit } from "../enums/unit.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsNull } from "typeorm";

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
    @IsOptional()
    quantity?: number | null;

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
