import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ShoppingList } from "../entities/shoppingList.entity";
import { Repository } from "typeorm";
import { ShoppingListItem } from "../entities/shoppingListItem.entity";
import { MealsService } from "src/meals/service/meals.service";
import { Unit } from "src/recipes/enums/unit.enum";

@Injectable()
export class ShoppingListService {
    constructor(
        @InjectRepository(ShoppingList)
        private readonly shoppingListRepository: Repository<ShoppingList>,

        @InjectRepository(ShoppingListItem)
        private readonly shoppingListItemRepository: Repository<ShoppingListItem>,

        private readonly mealsService: MealsService
    ) {}

    // Visualizza tutte le liste della spesa dell'utente loggato
    async getShoppingList(req: Request): Promise<ShoppingList[]>{

        const {userId} = req["user"]

        const shoppingList = await this.shoppingListRepository.find({
            where: {
                user: {
                    id: userId
                }
            },
            relations: ["shoppingListItem", "shoppingListItem.ingredient"]
        })

        return shoppingList
    }

    // Genera lista della spesa
    async generatedShoppingList(
        req: Request,
        startDate: Date,
        endDate: Date
    ): Promise<ShoppingList> {
        const { userId } = req["user"];
        let newShoppingList: ShoppingList;

        if (!startDate || !endDate) {
            throw new BadRequestException("Range date invalido");
        }

        const meals = await this.mealsService.getAllMeals(
            req,
            startDate,
            endDate
        );

        const allIngredients = meals
            .flatMap((meal) => meal.mealRecipe) // Prendi tutte le ricette di ogni meal
            .flatMap((mealRecipe) => mealRecipe.recipe.recipeIngredient); // Prendi tutti gli ingredienti

        // Controllo se esiste la lista
        const shoppingList = await this.shoppingListRepository.findOne({
            where: {
                startDate: startDate,
                endDate: endDate,
            },
        });

        // Se non esiste creo la lista
        if (!shoppingList) {
            newShoppingList = this.shoppingListRepository.create({
                startDate: startDate,
                endDate: endDate,
                user: {
                    id: userId,
                },
            });
            await this.shoppingListRepository.save(newShoppingList);
        } else {
            throw new ConflictException(
                "Lista già generate per questo range di date"
            );
        }

        for (const ing of allIngredients) {
            let convertedUnit: Unit = null;
            let convertedQuantity: number;

            // Controllo se esiste già l'ingrediente e l'unità, se si incrementa la quantità, altrimenti creo l'item
            if (ing.unit === Unit.G) {
                convertedUnit = Unit.KG;
                convertedQuantity = this.convertUnitQuantity(
                    Number(ing.quantity)
                );
            } else if (ing.unit === Unit.ML) {
                convertedUnit = Unit.L;
                convertedQuantity = this.convertUnitQuantity(
                    Number(ing.quantity)
                );
            } else if (ing.unit === Unit.QB) {
                convertedQuantity = this.convertUnitQuantity(
                    Number(ing.quantity)
                );
            }

            const existingShoppingListItem =
                await this.shoppingListItemRepository.findOne({
                    where: {
                        unit: convertedUnit ? convertedUnit : ing.unit,
                        shoppingList: {
                            id: newShoppingList.id,
                        },
                        ingredient: {
                            id: ing.ingredientId,
                        },
                    },
                });

            // Incrementa quantità
            if (existingShoppingListItem) {
                const newQuantity =
                    Number(existingShoppingListItem.quantity) +
                    Number(
                        convertedQuantity ? convertedQuantity : ing.quantity
                    );
                existingShoppingListItem.quantity = newQuantity;
                await this.shoppingListItemRepository.save(
                    existingShoppingListItem
                );
            } else {
                // Creo l'item
                const newShoppingListItem =
                    this.shoppingListItemRepository.create({
                        quantity: convertedQuantity
                            ? convertedQuantity
                            : ing.quantity,
                        unit: convertedUnit ? convertedUnit : ing.unit,
                        ingredient: {
                            id: ing.ingredientId,
                        },
                        shoppingList: {
                            id: newShoppingList.id,
                        },
                    });
                await this.shoppingListItemRepository.save(newShoppingListItem);
            }
        }

        /*for(const meal of meals){
            for(const mealRecipe of meal.mealRecipe){
                for(const recipeIng of mealRecipe.recipe.recipeIngredient){

                }
            }
        }*/

        return newShoppingList;
    }

    // Aggiornare stato isPurchases (false -> true, true -> false)
    async updateIsPurchases(id: number, idItem: number): Promise<ShoppingListItem>{

        const item = await this.shoppingListItemRepository.findOne({
            where: {
                id: idItem,
                shoppingList: {
                    id: id
                }
            }
        })

        item.isPurchased = !item.isPurchased

        return await this.shoppingListItemRepository.save(item)
    }

    // Converto l'unità
    convertUnitQuantity(quantity: number): number {
        if (quantity === null) {
            return null;
        } else {
            return quantity / 1000;
        }
    }
}
