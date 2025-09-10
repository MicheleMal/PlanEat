import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class MealRecipeDto{

    @ApiProperty({
        type: "number",
        name: "id",
        description: "Id ricetta da associare al pasto",
        example: 1
    })
    @IsNumber()
    @IsNotEmpty() 
    id: number

}