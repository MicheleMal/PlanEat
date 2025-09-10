import { Meal } from "src/meals/entity/meal.entity";
import { Recipe } from "src/recipes/entities/recipe.entity";
import { ShoppingList } from "src/shoppingList/entities/shoppingList.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 100,
        nullable: false,
        unique: true,
    })
    email: string;

    @Column({
        type: "varchar",
        nullable: false,
    })
    password: string;

    @Column({
        type: "varchar",
        length: 100,
        nullable: false,
        unique: true,
    })
    name: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @OneToMany(() => Recipe, (recipe) => recipe.user)
    recipes: Recipe[];

    @OneToMany(() => Meal, (meal) => meal.user)
    meals: Meal[];

    @OneToMany(() => ShoppingList, (shoppingList) => shoppingList.user)
    shoppingList: ShoppingList[];
}
