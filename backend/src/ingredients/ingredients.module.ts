import { Module } from "@nestjs/common";
import { IngredientsController } from "./controller/ingredients.controller";
import { IngredientsService } from "./service/ingredients.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ingredient } from "./entity/ingredient.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Ingredient])],
    controllers: [IngredientsController],
    providers: [IngredientsService],
    exports: [IngredientsService]
})
export class IngredientsModule {}
