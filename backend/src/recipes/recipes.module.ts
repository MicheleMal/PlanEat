import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { RecipeIngredient } from './entities/recipeIngredient.entity';
import { RecipesService } from './service/recipes.service';
import { RecipesController } from './controller/recipes.controller';
import { IngredientsModule } from 'src/ingredients/ingredients.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Recipe, RecipeIngredient
        ]),
        IngredientsModule,
    ],
    providers: [RecipesService],
    controllers: [RecipesController]
})
export class RecipesModule {}
