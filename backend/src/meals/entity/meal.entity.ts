import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { MealType } from "../enum/mealType.enum";
import { IsNotEmpty } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { MealRecipe } from "./mealRecipe.entity";

@Entity({ name: "meals" })
export class Meal {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column({
        type: "date",
        nullable: false,
    })
    date: Date;

    @IsNotEmpty()
    @Column({
        type: "enum",
        enum: MealType,
        enumName: "mealType",
    })
    mealType: MealType;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @ManyToOne(() => User, (user) => user.meals, {
        onDelete: "CASCADE",
    })
    @JoinColumn({
        name: "userId",
    })
    user: User;

    @OneToMany(()=>MealRecipe, (mealRecipe)=>mealRecipe.meal)
    mealRecipe: MealRecipe[]
}