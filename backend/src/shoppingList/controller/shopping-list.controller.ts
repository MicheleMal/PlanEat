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
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConflictResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
} from "@nestjs/swagger";

@ApiBearerAuth()
@Controller("shopping-list")
export class ShoppingListController {
    constructor(private readonly shoppingListService: ShoppingListService) {}

    @ApiOperation({
        summary: "Elenco di tutte le liste della spesa dell'utente loggato"
    })
    @ApiOkResponse({
        description: "Elenco di tutte le liste della spesa",
        example: {
            id: 306,
            quantity: "0.900",
            unit: "kg",
            isPurchased: false,
            ingredient: {
                id: 12,
                name: "Pomodori pelati",
            },
        },
    })
    @UseGuards(AuthGuard)
    @Get()
    async getShoppingList(@Request() req: Request) {
        return this.shoppingListService.getShoppingList(req);
    }

    @ApiOperation({
        summary: "Modifica stato comprato (comprato->non comprato, non comprato->comprato) di un item associato ad una lista della spesa"
    })
    @ApiParam({
        name: "id",
        description: "id lista della spesa",
    })
    @ApiParam({
        name: "idItem",
        description: "Id item da modificare",
    })
    @ApiOkResponse({
        description: "Item modificato",
        example: {
            id: 306,
            quantity: "0.900",
            unit: "kg",
            isPurchased: true,
        },
    })
    @UseGuards(AuthGuard)
    @Put(":id/items/:idItem")
    async updateIsPurchases(
        @Param("id") id: number,
        @Param("idItem") idItem: number
    ) {
        return this.shoppingListService.updateIsPurchases(id, idItem);
    }

    @ApiOperation({
        summary: "Genera lista della spesa per range di date, se già non presente"
    })
    @ApiQuery({
        name: "startDate",
        description: "Data inizio range",
    })
    @ApiQuery({
        name: "endDate",
        description: "Data fine range",
    })
    @ApiBadRequestResponse({ description: "Range date invalide" })
    @ApiConflictResponse({
        description: "Lista già generata per questo range di date",
    })
    @ApiOkResponse({
        description: "Lista della spesa generate",
        example: {
            startDate: "2025-09-04",
            endDate: "2025-12-30",
            user: {
                id: 1,
            },
            id: 96,
            createdAt: "2025-09-10T17:16:15.419Z",
        },
    })
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
