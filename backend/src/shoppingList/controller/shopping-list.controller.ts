import {
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    Request,
    UseGuards,
} from "@nestjs/common";
import { ShoppingListService } from "../service/shopping-list.service";
import { AuthGuard } from "src/auth/guard/auth.guard";

@Controller("shopping-list")
export class ShoppingListController {
    constructor(private readonly shoppingListService: ShoppingListService) {}

    @UseGuards(AuthGuard)
    @Get()
    async getShoppingList(@Request() req: Request) {
        return this.shoppingListService.getShoppingList(req);
    }

    @UseGuards(AuthGuard)
    @Put(":id/items/:idItem")
    async updateIsPurchases(
        @Param("id") id: number,
        @Param("idItem") idItem: number
    ) {
        return this.shoppingListService.updateIsPurchases(id, idItem);
    }

    @UseGuards(AuthGuard)
    @Post()
    async generatedShoppingList(
        @Query("startDate") startDate: Date,
        @Query("endDate") endDate: Date,
        @Request() req: Request
    ) {
        return this.shoppingListService.generatedShoppingList(
            req,
            startDate,
            endDate
        );
    }
}
