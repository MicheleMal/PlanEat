import { Module } from '@nestjs/common';
import { MealsService } from './service/meals.service';
import { MealsController } from './controller/meals.controller';

@Module({
    providers: [MealsService],
    controllers: [MealsController]
})
export class MealsModule {}
