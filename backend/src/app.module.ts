import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users/entities/user.entity";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { Recipe } from "./recipes/entities/recipe.entity";
import { Ingredient } from "./ingredients/entity/ingredient.entity";
import { RecipeIngredient } from "./recipes/entities/recipeIngredient.entity";
import { IngredientsModule } from "./ingredients/ingredients.module";
import { RecipesModule } from "./recipes/recipes.module";
import { MealsModule } from "./meals/meals.module";
import { Meal } from "./meals/entity/meal.entity";
import { MealRecipe } from "./meals/entity/mealRecipe.entity";
import { ShoppingList } from "./shoppingList/entities/shoppingList.entity";
import { ShoppingListItem } from "./shoppingList/entities/shoppingListItem.entity";
import { ShoppingListModule } from "./shoppingList/shopping-list.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "root",
            password: "",
            database: "PlanEat",
            entities: [
                User,
                Recipe,
                Ingredient,
                RecipeIngredient,
                Meal,
                MealRecipe,
                ShoppingList,
                ShoppingListItem,
            ],
            synchronize: true,
            //logging: ["query"]
        }),
        AuthModule,
        IngredientsModule,
        RecipesModule,
        MealsModule,
        ShoppingListModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
