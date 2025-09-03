import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Meal } from "./meal.entity";
import { Recipe } from "src/recipes/entities/recipe.entity";

@Entity({})
export class MealRecipe{

    @PrimaryColumn()
    mealId: number

    @PrimaryColumn()
    recipeId: number

    @ManyToOne(()=>Meal, (meal)=>meal.mealRecipe, {
        onDelete: "CASCADE"
    })
    @JoinColumn({name: "mealId"})
    meal: Meal

    @ManyToOne(()=>Recipe, (recipe)=>recipe.mealRecipe, {
        onDelete: "CASCADE"
    })
    @JoinColumn({name: "recipeId"})
    recipe: Recipe

}