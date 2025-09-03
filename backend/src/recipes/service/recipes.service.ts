import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { RecipeIngredient } from "../entities/recipeIngredient.entity";
import { IngredientsService } from "src/ingredients/service/ingredients.service";
import { CreateRecipeDto } from "../dto/create-recipe.dto";
import { Recipe } from "../entities/recipe.entity";
import { UpdateRecipeDto } from "../dto/update-recipe.dto";

//? Controllare campi univoci

@Injectable()
export class RecipesService {
    constructor(
        @InjectRepository(Recipe)
        private readonly recipeRepository: Repository<Recipe>,
        @InjectRepository(RecipeIngredient)
        private readonly recipeIngredientRepository: Repository<RecipeIngredient>,
        private readonly ingredientsService: IngredientsService
    ) {}

    /* Crea una nuova ricetta verificando gli ingredienti:
        - Se un ingrediente esiste, lo riutilizza
        - Se non esiste, lo crea
    */
    async createRecipe(
        createRecipeDto: CreateRecipeDto,
        req: Request
    ): Promise<Recipe> {
        const { userId } = req["user"];

        const newRecipe = this.recipeRepository.create({
            ...createRecipeDto,
            user: {
                id: userId,
            },
        });

        await this.recipeRepository.save(newRecipe);

        for (const ing of createRecipeDto.ingredients) {
            const ingredient = await this.ingredientsService.findOrCreate(
                ing.name
            );

            const newRecipeIngredient = this.recipeIngredientRepository.create({
                recipeId: newRecipe.id,
                ingredientId: ingredient.id,
                quantity: ing.quantity,
                unit: ing.unit,
            });

            await this.recipeIngredientRepository.save(newRecipeIngredient);
        }

        return newRecipe;
    }

    // Ottiene una determinata ricetta tramite id
    async getRecipeById(req: Request, id: number): Promise<Recipe> {
        const { userId } = req["user"];

        const recipe = await this.recipeRepository.findOne({
            where: {
                id: id,
                user: userId,
            },
            relations: ["recipeIngredient", "recipeIngredient.ingredient"],
        });

        return recipe;
    }

    // Ottieni tutte le ricette di un determinato utente e/o effettuando una ricerca tramite titolo e/o tramite ingrediente
    async getRecipes(req: Request, title?: string): Promise<Recipe[]> {
        const { userId } = req["user"];

        let recipes: Recipe[];

        if (title) {
            recipes = await this.recipeRepository.find({
                where: {
                    user: {
                        id: userId,
                    },
                    title: Like(`${title}%`),
                },
                relations: ["recipeIngredient", "recipeIngredient.ingredient"],
            });
        }else {
            recipes = await this.recipeRepository.find({
                where: {
                    user: {
                        id: userId,
                    },
                },
                relations: ["recipeIngredient", "recipeIngredient.ingredient"],
            });
        }

        return recipes;
    }

    // Modifica ricetta
    // L'utente può modificare: title, description, prepTime
    // Modificare ingredienti (quantity, unit) associato alla ricetta
    // Aggiungere un nuovo ingrediente alla ricetta
    // Eliminare un ingrediente associato alla ricetta, inserendo delete true come campo
    async updateRecipe(
        req: Request,
        updateRecipeDto: UpdateRecipeDto,
        id: number
    ): Promise<Recipe> {
        const { userId } = req["user"];

        // 1. Modifica campi ricetta
        const { ingredients, ...recipeFields } = updateRecipeDto;

        if (Object.keys(recipeFields).length > 0) {
            await this.recipeRepository.update(
                {
                    id: id,
                    user: {
                        id: userId,
                    },
                },
                recipeFields
            );
        }

        if (ingredients && ingredients.length > 0) {
            for (const ing of updateRecipeDto.ingredients) {
                // 2. Modifica campi ingrediente (quantity, unit)
                if (ing.ingredientId && !ing.delete) {
                    await this.recipeIngredientRepository.update(
                        {
                            recipeId: id,
                            ingredientId: ing.ingredientId,
                        },
                        ing
                    );
                }

                // 3. Aggiungere un nuovo ingrediente alla ricetta
                if (!ing.ingredientId && !ing.delete) {
                    const ingredient =
                        await this.ingredientsService.findOrCreate(ing.name);

                    const newRecipeIngredient =
                        this.recipeIngredientRepository.create({
                            recipeId: id,
                            ingredientId: ingredient.id,
                            quantity: ing.quantity,
                            unit: ing.unit,
                        });

                    await this.recipeIngredientRepository.save(
                        newRecipeIngredient
                    );
                }

                // 4. Eliminare un ingrediente associato alla ricetta
                if (ing.ingredientId && ing.delete) {
                    await this.recipeIngredientRepository.delete({
                        recipeId: id,
                        ingredientId: ing.ingredientId,
                    });
                }
            }
        }

        const recipe = await this.recipeRepository.findOne({
            where: {
                id: id,
                user: {
                    id: userId,
                },
            },
            relations: ["recipeIngredient", "recipeIngredient.ingredient"],
        });

        return recipe;
    }

    // Eliminazione ricetta
    async deleteRecipe(req: Request, id: number): Promise<boolean> {
        const { userId } = req["user"];

        await this.recipeRepository.delete({
            id: id,
            user: {
                id: userId,
            },
        });

        return true;
    }
}
