import { RecipeIngredient } from "src/recipes/entities/recipeIngredient.entity";
import { ShoppingListItem } from "src/shoppingList/entities/shoppingListItem.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "ingredients" })
export class Ingredient {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        nullable: false,
        unique: true,
    })
    name: string;

    @OneToMany(
        () => RecipeIngredient,
        (recipeIngredient) => recipeIngredient.ingredient
    )
    recipeIngredient: RecipeIngredient[];

    @OneToMany(
        () => ShoppingListItem,
        (shoppingListItem) => shoppingListItem.ingredient
    )
    shoppingListItem: ShoppingListItem[];
}
