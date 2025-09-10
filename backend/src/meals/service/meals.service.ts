import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Meal } from "../entity/meal.entity";
import { Between, Repository } from "typeorm";
import { MealRecipe } from "../entity/mealRecipe.entity";
import { CreateMealDto } from "../dto/create-meal.dto";
import { UpdateMealDto } from "../dto/update-meal.dto";

@Injectable()
export class MealsService {
    constructor(
        @InjectRepository(Meal)
        private readonly mealRepository: Repository<Meal>,
        @InjectRepository(MealRecipe)
        private readonly mealRecipeRepository: Repository<MealRecipe>
    ) {}

    // Creazione nuovo pasto
    async createMeal(
        req: Request,
        createMealDto: CreateMealDto
    ): Promise<Omit<Meal, "user">> {
        const { userId } = req["user"];

        const newMeal = this.mealRepository.create({
            ...createMealDto,
            user: {
                id: userId,
            },
        });

        await this.mealRepository.save(newMeal);

        for (const recipe of createMealDto.recipes) {
            const newMealRecipe = this.mealRecipeRepository.create({
                mealId: newMeal.id,
                recipeId: recipe.id,
            });

            await this.mealRecipeRepository.save(newMealRecipe);
        }

        return newMeal;
    }

    // Elenco di tutti i pasti
    // Elenco di tutti i pasti per range date (startDate - endDate)
    async getAllMeals(
        req: Request,
        startDate?: Date,
        endDate?: Date
    ): Promise<Meal[]> {
        const { userId } = req["user"];
        let meals: Meal[];

        if (startDate && endDate) {
            meals = await this.mealRepository.find({
                where: {
                    user: {
                        id: userId,
                    },
                    date: Between(startDate, endDate),
                },
                order: {
                    date: "ASC",
                    mealType: "ASC",
                },
                relations: ["mealRecipe", "mealRecipe.recipe", "mealRecipe.recipe.recipeIngredient"],
            });
        } else {
            meals = await this.mealRepository.find({
                where: {
                    user: {
                        id: userId,
                    },
                },
                relations: ["mealRecipe", "mealRecipe.recipe"],
            });
        }

        return meals;
    }

    // Visualizzazione di un determinato pasto
    async getMealById(req: Request, id: number): Promise<Meal> {
        const { userId } = req["user"];

        const meal = await this.mealRepository.findOne({
            where: {
                user: {
                    id: userId,
                },
                id: id,
            },
            relations: ["mealRecipe", "mealRecipe.recipe"],
        });

        return meal;
    }

    // Modifica pasto
    // L'utente può modificare: data, mealType
    // Eliminare da un pasto una ricetta
    async updateMeal(
        req: Request,
        id: number,
        updateMealDto: UpdateMealDto
    ): Promise<Meal> {
        const { userId } = req["user"];

        const { recipes, ...mealFields } = updateMealDto;

        if (Object.keys(mealFields).length > 0) {
            await this.mealRepository.update(
                {
                    id: id,
                    user: {
                        id: userId,
                    },
                },
                mealFields
            );
        }

        if (recipes && recipes.length > 0) {
            for (const recipe of recipes) {
                await this.mealRecipeRepository.delete({
                    mealId: id,
                    recipeId: recipe.id,
                });
            }
        }

        const meal = await this.mealRepository.findOne({
            where: {
                user: {
                    id: userId,
                },
                id: id,
            },
            relations: ["mealRecipe", "mealRecipe.recipe"],
        });

        return meal;
    }

    // Eliminare ricetta
    async deleteMeal(req: Request, id: number): Promise<boolean> {
        const { userId } = req["user"];

        await this.mealRepository.delete({
            id: id,
            user: {
                id: userId,
            },
        });

        return true;
    }
}
