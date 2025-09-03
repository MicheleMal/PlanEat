import { PartialType } from "@nestjs/mapped-types";
import { CreateMealDto } from "./create-meal.dto";

export class UpdateMealDto extends PartialType(CreateMealDto){

    /*@IsOptional()
    @IsDateString()
    date?: Date

    @IsOptional()
    @IsEnum(MealType)
    mealType?: MealType

    @IsArray()
    @ValidateNested({each: true})
    @Type(()=>UpdateMealRecipeDto)
    @IsOptional()
    recipes?: UpdateMealRecipeDto[]*/
    

}