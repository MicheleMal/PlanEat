import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Recipe } from "./recipe.entity";
import { Unit } from "../enums/unit.enum";
import { Ingredient } from "src/ingredients/entity/ingredient.entity";

@Entity()
export class RecipeIngredient {
    @PrimaryColumn()
    recipeId: number;

    @PrimaryColumn()
    ingredientId: number;

    @ManyToOne(() => Recipe, (recipe) => recipe.recipeIngredient, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "recipeId" })
    recipe: Recipe;

    @ManyToOne(() => Ingredient, (ingredient) => ingredient.recipeIngredient, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "ingredientId" })
    ingredient: Ingredient;

    @Column({
        type: "int",
        nullable: true
    })
    quantity: number;

    @Column({
        type: "enum",
        enum: Unit,
        enumName: "unit",
        default: Unit.PZ,
        nullable: false
    })
    unit: Unit;
}
