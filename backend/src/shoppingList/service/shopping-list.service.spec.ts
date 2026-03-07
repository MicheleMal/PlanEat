import { Test, TestingModule } from "@nestjs/testing";
import { ShoppingListService } from "./shopping-list.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ShoppingList } from "../entities/shoppingList.entity";
import { ShoppingListItem } from "../entities/shoppingListItem.entity";
import { MealsService } from "src/meals/service/meals.service";

describe("ShoppingListService", () => {
    let service: ShoppingListService;

    const mockShoppingListRepository = {};

    const mockShoppingListItemRepository = {};

    const mockMealsService = {};

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ShoppingListService,
                {
                    provide: MealsService,
                    useValue: mockMealsService,
                },
                {
                    provide: getRepositoryToken(ShoppingList),
                    useValue: mockShoppingListRepository,
                },
                {
                    provide: getRepositoryToken(ShoppingListItem),
                    useValue: mockShoppingListItemRepository,
                },
            ],
        }).compile();

        service = module.get<ShoppingListService>(ShoppingListService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
