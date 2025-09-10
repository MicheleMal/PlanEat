import { IsArray, IsDateString, IsEnum, IsNotEmpty, ValidateNested } from "class-validator"
import { MealType } from "../enum/mealType.enum"
import { MealRecipeDto } from "./mealRecipe.dto"
import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"

export class CreateMealDto{

    @ApiProperty({
        type: "string",
        format: "date-time",
        title: "date",
        description: "Data del pasto",
        example: "2025-09-10"
    })
    @IsDateString()
    @IsNotEmpty()
    date: Date

    @ApiProperty({
        enum: MealType,
        enumName: "mealType",
        description: `Tipo di pasto, tra: ${MealType.APERITIVO}, ${MealType.CENA}, ${MealType.COLAZIONE}, ${MealType.MERENDA}, ${MealType.PRANZO}`,
        example: MealType.CENA
    })
    @IsEnum(MealType)
    @IsNotEmpty()
    mealType: MealType

    @ApiProperty({
        type: ()=>[MealRecipeDto],
        isArray: true,
        name: "recipes",
        description: "Id delle ricette assegnate al pasto",
        example: [
            {id: 10},
            {id: 15}
        ]
    })
    @IsArray()
    @ValidateNested({each: true})
    @Type(()=>MealRecipeDto)
    @IsNotEmpty()
    recipes: MealRecipeDto[]

}