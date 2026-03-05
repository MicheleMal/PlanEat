import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from "typeorm";
import { User } from "src/users/entities/user.entity";
import { RecipeIngredient } from "./recipeIngredient.entity";
import { MealRecipe } from "src/meals/entity/mealRecipe.entity";

@Entity({ name: "recipes" })
@Unique(["title", "user"])
export class Recipe {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        nullable: false,
    })
    title: string;

    @Column({
        type: "varchar",
        nullable: true,
    })
    description: string;

    @Column({
        type: "int",
        nullable: true,
    })
    prepTime: number; // minuti

    @ManyToOne(() => User, (user) => user.recipes, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "userId" })
    user: User;

    @OneToMany(
        () => RecipeIngredient,
        (recipeIngredient) => recipeIngredient.recipe
    )
    recipeIngredient: RecipeIngredient[];

    @OneToMany(
        () => MealRecipe,
        (mealRecipe) => mealRecipe.recipe
    )
    mealRecipe: MealRecipe[];
}
