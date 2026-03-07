import { Test, TestingModule } from "@nestjs/testing";
import { ShoppingListController } from "./shopping-list.controller";
import { ShoppingListService } from "../service/shopping-list.service";
import { AuthGuard } from "src/auth/guard/auth.guard";

describe("ShoppingListController", () => {
    let controller: ShoppingListController;

    const mockShoppingListService = [];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ShoppingListController],
            providers: [
                {
                    provide: ShoppingListService,
                    useValue: mockShoppingListService,
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({
                canActivate: jest.fn(() => true),
            })
            .compile();

        controller = module.get<ShoppingListController>(ShoppingListController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
