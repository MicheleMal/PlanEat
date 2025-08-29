import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RecipeIngredient } from "./recipeIngredient.entity";

@Entity()
export class Ingredient{

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: "varchar",
        nullable: false,
        unique: true
    })
    name: string

    @OneToMany(() => RecipeIngredient, recipeIngredient => recipeIngredient.ingredient)
    recipeIngredient: RecipeIngredient[]

}