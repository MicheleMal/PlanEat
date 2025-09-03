import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Ingredient } from "../entity/ingredient.entity";
import { Repository } from "typeorm";

@Injectable()
export class IngredientsService {
    constructor(
        @InjectRepository(Ingredient)
        private readonly ingredientRepository: Repository<Ingredient>
    ) {}

    // Restituisce ingrediente se esiste, altrimenti lo crea
    async findOrCreate(name: string): Promise<Ingredient>{
        const ingredient = await this.ingredientRepository
            .createQueryBuilder("ing")
            .where("LOWER(ing.name) = LOWER(:name)", {
                name: `${name}`
            })
            .getOne()

        if(!ingredient){
            const newIngredient = this.ingredientRepository.create({
                name: name
            })

            await this.ingredientRepository.save(newIngredient)

            return newIngredient
        }
        
        return ingredient
    }

    // Restituisce lista ingredienti altrimenti array vuoto
    async getIngredients(name: string): Promise<Ingredient[]> {
        const ingredients = await this.ingredientRepository
            .createQueryBuilder("ing")
            .where("LOWER(ing.name) LIKE LOWER(:name)", {
                name: `${name}%`,
            })
            .getMany();

        console.log(ingredients)

        return ingredients;
    }
}
