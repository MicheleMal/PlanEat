import { Module } from "@nestjs/common";
import { ShoppingListService } from "./service/shopping-list.service";
import { ShoppingListController } from "./controller/shopping-list.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShoppingList } from "./entities/shoppingList.entity";
import { ShoppingListItem } from "./entities/shoppingListItem.entity";
import { MealsModule } from "src/meals/meals.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([ShoppingList, ShoppingListItem]),
        MealsModule,
    ],
    providers: [ShoppingListService],
    controllers: [ShoppingListController],
})
export class ShoppingListModule {}
