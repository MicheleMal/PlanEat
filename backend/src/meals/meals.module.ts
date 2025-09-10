import { Module } from '@nestjs/common';
import { MealsService } from './service/meals.service';
import { MealsController } from './controller/meals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from './entity/meal.entity';
import { MealRecipe } from './entity/mealRecipe.entity';

@Module({
    imports: [TypeOrmModule.forFeature([
        Meal, MealRecipe
    ])],
    providers: [MealsService],
    controllers: [MealsController],
    exports: [MealsService]
})
export class MealsModule {}
