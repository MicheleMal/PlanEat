import { Test, TestingModule } from "@nestjs/testing";
import { RecipesController } from "./recipes.controller";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { RecipesService } from "../service/recipes.service";
import { Unit } from "../enums/unit.enum";

describe("RecipesController", () => {
    let controller: RecipesController;

    const fakeRequest = {
        user: {
            userId: 1,
        },
    } as unknown as Request;

    const mockRecipesService = {
        createRecipe: jest.fn(),
        getRecipeById: jest.fn(),
        getRecipes: jest.fn(),
        updateRecipe: jest.fn(),
        deleteRecipe: jest.fn(),
    };

    const fakeRecipes = [
        {
            id: 1,
            title: "title test",
            description: "description test",
            prepTime: 2,
            ingredients: [
                {
                    id: 1,
                    name: "Pomodoro",
                    quantity: 1,
                    unit: Unit.G,
                },
            ],
            user: {
                id: fakeRequest["user"].userId,
            },
        },
    ];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RecipesController],
            providers: [
                {
                    provide: RecipesService,
                    useValue: mockRecipesService,
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        controller = module.get<RecipesController>(RecipesController);
    });

    it("should call service create recipe", async () => {
        const createRecipeDto = {
            title: "title test",
            description: "description test",
            prepTime: 2,
            ingredients: [
                {
                    id: 1,
                    name: "Pomodoro",
                    quantity: 1,
                    unit: Unit.G,
                },
            ],
        };

        const fakeSavedRecipe = {
            id: 1,
            ...createRecipeDto,
            user: {
                id: fakeRequest["user"].userId,
            },
        };

        mockRecipesService.createRecipe.mockResolvedValue(fakeSavedRecipe);

        const result = await controller.createRecipe(
            createRecipeDto,
            fakeRequest,
        );

        expect(mockRecipesService.createRecipe).toHaveBeenCalledWith(
            createRecipeDto,
            fakeRequest,
        );
        expect(result).toEqual(fakeSavedRecipe);
    });

    it("should call service get recipe by id", async () => {
        mockRecipesService.getRecipeById.mockResolvedValue(fakeRecipes[0]);

        const result = await controller.getRecipeById(fakeRequest, 1);

        expect(mockRecipesService.getRecipeById).toHaveBeenCalledWith(
            fakeRequest,
            1,
        );
        expect(result).toEqual(fakeRecipes[0]);
    });

    it("should call service get all recipes", async () => {
        mockRecipesService.getRecipes.mockResolvedValue(fakeRecipes);

        const result = await controller.getAllRecipes(fakeRequest, "Pasta");

        expect(mockRecipesService.getRecipes).toHaveBeenCalledWith(
            fakeRequest,
            "Pasta",
        );
        expect(result).toEqual(fakeRecipes);
    });

    it("should call service update recipe", async () => {
        const updateRecipeDto = {
            title: "Pasta",
            ingredients: [
                {
                    ingredientId: 1,
                    quantity: 4
                }
            ]
        }
        
        mockRecipesService.updateRecipe.mockResolvedValue(fakeRecipes[0]);

        const result = await controller.updateRecipe(fakeRequest, updateRecipeDto, 1);

        expect(mockRecipesService.updateRecipe).toHaveBeenCalledWith(
            fakeRequest,
            updateRecipeDto,
            1
        );
        expect(result).toEqual(fakeRecipes[0]);
    });

    it("should call service delete recipe", async () => {
        mockRecipesService.deleteRecipe.mockResolvedValue(true);

        const result = await controller.deleteRecipe(fakeRequest, 1);

        expect(mockRecipesService.deleteRecipe).toHaveBeenCalledWith(
            fakeRequest,
            1
        );
        expect(result).toBe(true);
    });
});
