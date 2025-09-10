import { Ingredient } from "src/ingredients/entity/ingredient.entity";
import { Unit } from "src/recipes/enums/unit.enum";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ShoppingList } from "./shoppingList.entity";

@Entity({})
export class ShoppingListItem {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "decimal",
        precision: 6,
        scale: 3,
        nullable: true,
    })
    quantity: number;

    @Column({
        type: "enum",
        enum: Unit,
        enumName: "unit",
        nullable: false,
    })
    unit: Unit;

    @Column({
        type: "boolean",
        default: false,
    })
    isPurchased: boolean;

    @ManyToOne(() => Ingredient, (ingredient) => ingredient, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "ingredientId" })
    ingredient: Ingredient;

    @ManyToOne(() => ShoppingList, (shoppingList) => shoppingList, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "shoppingListId" })
    shoppingList: ShoppingList;
}
