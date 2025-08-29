import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Recipe } from "./recipe.entity";
import { Ingredient } from "./ingredient.entity";
import { Unit } from "../enums/unit.enum";

@Entity()
export class RecipeIngredient{

    @PrimaryColumn()
    recipeId: number

    @PrimaryColumn()
    ingredientId: number

    @ManyToOne(()=>Recipe, recipe => recipe.recipeIngredient)
    @JoinColumn({name: "recipeId"})
    recipe: Recipe

    @ManyToOne(()=>Ingredient, ingredient => ingredient.recipeIngredient)
    @JoinColumn({name: "ingredientId"})
    ingredient: Ingredient

    quantity: number

    @Column({
        type: "enum",
        enum: Unit,
        enumName: "unit",
        default: Unit.G
    })
    unit: Unit

}