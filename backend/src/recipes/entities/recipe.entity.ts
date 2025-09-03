import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "src/users/entities/user.entity";
import { RecipeIngredient } from "./recipeIngredient.entity";

@Entity({ name: "recipes" })
export class Recipe {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        nullable: false,
        unique: true,
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
}
