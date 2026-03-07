import { Test, TestingModule } from "@nestjs/testing";
import { RecipesService } from "./recipes.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Recipe } from "../entities/recipe.entity";
import { RecipeIngredient } from "../entities/recipeIngredient.entity";
import { Ingredient } from "src/ingredients/entity/ingredient.entity";
import { IngredientsService } from "src/ingredients/service/ingredients.service";
import { Like } from "typeorm";
import { Unit } from "../enums/unit.enum";
import { ConflictException } from "@nestjs/common";

describe("RecipesService", () => {
    let service: RecipesService;

    const fakeRequest = {
        user: {
            userId: 1,
        },
    } as unknown as Request;

    const fakeRecipes = [
        {
            id: 1,
            title: "recipe test",
            description: "recipe test description",
            prepTime: 10,
            userId: fakeRequest["user"].userId,
        },
        {
            id: 2,
            title: "recipe test 2",
            description: "recipe test description 2",
            prepTime: 40,
            userId: fakeRequest["user"].userId,
        },
    ];

    const mockRecipesRepository = {
        findOne: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
    };

    const mockRecipeIngredientRepository = {
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    const mockIngredientsService = {
        findOrCreate: jest.fn().mockResolvedValue({ id: 1, name: "Pomodoro" }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RecipesService,
                {
                    provide: IngredientsService,
                    useValue: mockIngredientsService,
                },
                {
                    provide: getRepositoryToken(Recipe),
                    useValue: mockRecipesRepository,
                },
                {
                    provide: getRepositoryToken(RecipeIngredient),
                    useValue: mockRecipeIngredientRepository,
                },
            ],
        }).compile();

        service = module.get<RecipesService>(RecipesService);

        jest.clearAllMocks();
    });

    describe("getRecipeById", () => {
        it("should be return recipe by id", async () => {
            mockRecipesRepository.findOne.mockResolvedValue(fakeRecipes[0]);

            const result = await service.getRecipeById(fakeRequest, 1);

            expect(mockRecipesRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    user: fakeRequest["user"].userId,
                },
                relations: ["recipeIngredient", "recipeIngredient.ingredient"],
            });

            expect(result).toEqual(fakeRecipes[0]);
        });

        it("should return null if recipe does not exist", async () => {
            mockRecipesRepository.findOne.mockResolvedValue(null);

            const result = await service.getRecipeById(fakeRequest, 100);

            expect(mockRecipesRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 100,
                    user: fakeRequest["user"].userId,
                },
                relations: ["recipeIngredient", "recipeIngredient.ingredient"],
            });

            expect(result).toBeNull();
        });
    });

    describe("getRecipes", () => {
        it("should return all the recipes of the logged in user", async () => {
            mockRecipesRepository.find.mockResolvedValue(fakeRecipes);

            const result = await service.getRecipes(fakeRequest);

            expect(mockRecipesRepository.find).toHaveBeenCalledWith({
                where: {
                    user: {
                        id: fakeRequest["user"].userId,
                    },
                },
                relations: ["recipeIngredient", "recipeIngredient.ingredient"],
            });

            expect(result).toEqual(fakeRecipes);
        });

        it("should return all recipes filtered by the logged in user's title.", async () => {
            const title = "pas";
            mockRecipesRepository.find.mockResolvedValue(fakeRecipes);

            const result = await service.getRecipes(fakeRequest, title);

            expect(mockRecipesRepository.find).toHaveBeenCalledWith({
                where: {
                    user: {
                        id: fakeRequest["user"].userId,
                    },
                    title: Like(`${title}%`),
                },
                relations: ["recipeIngredient", "recipeIngredient.ingredient"],
            });

            expect(result).toEqual(fakeRecipes);
        });
    });

    describe("deleteRecipe", () => {
        it("should delete a recipe", async () => {
            mockRecipesRepository.delete.mockResolvedValue({
                affected: 1,
            });

            const result = await service.deleteRecipe(fakeRequest, 1);

            expect(mockRecipesRepository.delete).toHaveBeenCalledWith({
                id: 1,
                user: {
                    id: fakeRequest["user"].userId,
                },
            });

            expect(result).toBe(true);
        });
    });

    describe("createRecipe", () => {
        const createRecipeDto = {
            title: "Test",
            description: "Description test",
            prepTime: 3,
            ingredients: [
                {
                    name: "Pomodoro",
                    quantity: 20,
                    unit: Unit.PZ,
                },
            ],
        };

        it("should successfully create a recipe", async () => {
            const fakeIngredient = {
                id: 1,
                ...createRecipeDto.ingredients[0],
            };

            const fakeSavedRecipe = { id: 1, ...createRecipeDto };

            mockRecipesRepository.findOne.mockResolvedValue(null);
            mockRecipesRepository.create.mockReturnValue({
                ...createRecipeDto,
                id: fakeSavedRecipe.id,
                user: {
                    id: fakeRequest["user"].userId,
                },
            });
            mockRecipesRepository.save.mockResolvedValue(fakeSavedRecipe);

            mockIngredientsService.findOrCreate.mockResolvedValue({
                id: fakeIngredient.id,
                name: fakeIngredient.name,
            });

            mockRecipeIngredientRepository.create.mockReturnValue({
                recipeId: fakeSavedRecipe.id,
                ingredientId: fakeIngredient.id,
                quantity: createRecipeDto.ingredients[0].quantity,
                unit: createRecipeDto.ingredients[0].unit,
            });

            mockRecipeIngredientRepository.save.mockResolvedValue({
                id: 1,
                recipeId: fakeSavedRecipe.id,
                ingredientId: fakeIngredient.id,
                quantity: createRecipeDto.ingredients[0].quantity,
                unit: createRecipeDto.ingredients[0].unit,
            });

            const result = await service.createRecipe(
                createRecipeDto,
                fakeRequest,
            );

            expect(mockIngredientsService.findOrCreate).toHaveBeenCalledWith(
                "Pomodoro",
            );

            expect(mockRecipeIngredientRepository.create).toHaveBeenCalledWith({
                recipeId: fakeSavedRecipe.id,
                ingredientId: fakeIngredient.id,
                quantity: createRecipeDto.ingredients[0].quantity,
                unit: createRecipeDto.ingredients[0].unit,
            });

            expect(mockRecipeIngredientRepository.save).toHaveBeenCalledWith({
                recipeId: fakeSavedRecipe.id,
                ingredientId: fakeIngredient.id,
                quantity: createRecipeDto.ingredients[0].quantity,
                unit: createRecipeDto.ingredients[0].unit,
            });

            expect(mockRecipesRepository.findOne).toHaveBeenCalledWith({
                where: {
                    title: createRecipeDto.title,
                },
            });
            expect(mockRecipesRepository.create).toHaveBeenCalledWith({
                ...createRecipeDto,
                user: {
                    id: fakeRequest["user"].userId,
                },
            });
            expect(mockRecipesRepository.save).toHaveBeenCalledWith({
                ...fakeSavedRecipe,
                user: {
                    id: fakeRequest["user"].userId,
                },
            });

            expect(result).toEqual({
                ...fakeSavedRecipe,
                user: {
                    id: fakeRequest["user"].userId,
                },
            });
        });

        it("should throw a conflict exception because the recipe already exists", async () => {
            mockRecipesRepository.findOne.mockResolvedValue(fakeRecipes[0]);

            await expect(
                service.createRecipe(createRecipeDto, fakeRequest),
            ).rejects.toThrow(ConflictException);

            expect(mockRecipesRepository.create).not.toHaveBeenCalled();
            expect(mockRecipesRepository.save).not.toHaveBeenCalled();
            expect(mockIngredientsService.findOrCreate).not.toHaveBeenCalled();
            expect(
                mockRecipeIngredientRepository.create,
            ).not.toHaveBeenCalled();
            expect(mockRecipeIngredientRepository.save).not.toHaveBeenCalled();
        });

        it("should create a recipe with no ingredients", async () => {
            const createRecipeDto = {
                title: "Test",
                description: "Description test",
                prepTime: 3,
                ingredients: [], // array vuoto
            };

            const fakeSavedRecipe = { id: 1, ...createRecipeDto };

            mockRecipesRepository.findOne.mockResolvedValue(null);
            mockRecipesRepository.create.mockReturnValue({
                ...createRecipeDto,
                id: fakeSavedRecipe.id,
                user: { id: fakeRequest["user"].userId },
            });
            mockRecipesRepository.save.mockResolvedValue({
                ...fakeSavedRecipe,
                user: { id: fakeRequest["user"].userId },
            });

            const result = await service.createRecipe(
                createRecipeDto,
                fakeRequest,
            );

            // Ingredient service non deve essere chiamato
            expect(mockIngredientsService.findOrCreate).not.toHaveBeenCalled();

            expect(mockRecipesRepository.findOne).toHaveBeenCalledWith({
                where: { title: createRecipeDto.title },
            });

            expect(mockRecipesRepository.create).toHaveBeenCalledWith({
                ...createRecipeDto,
                user: { id: fakeRequest["user"].userId },
            });

            expect(mockRecipesRepository.save).toHaveBeenCalledWith({
                ...fakeSavedRecipe,
                user: { id: fakeRequest["user"].userId },
            });

            expect(mockIngredientsService.findOrCreate).not.toHaveBeenCalled();

            expect(
                mockRecipeIngredientRepository.create,
            ).not.toHaveBeenCalled();

            expect(mockRecipeIngredientRepository.save).not.toHaveBeenCalled();

            expect(result).toEqual({
                ...fakeSavedRecipe,
                user: { id: fakeRequest["user"].userId },
            });
        });
    });

    describe("updateRecipe", () => {

        it("should change the recipe fields: title, description, and prepTime", async () => {
            const updateRecipeDto = {
                title: "Test modificato",
                prepTime: 100,
            };

            const fakeUpdatedRecipe = {
                ...updateRecipeDto,
                description: "test description",
                userId: fakeRequest["user"].userId,
            };

            mockRecipesRepository.update.mockResolvedValue({
                affected: 1,
            });

            mockRecipesRepository.findOne.mockResolvedValue({
                title: updateRecipeDto.title,
                description: "test description",
                prepTime: updateRecipeDto.prepTime,
                userId: fakeRequest["user"].userId,
            });

            const result = await service.updateRecipe(
                fakeRequest,
                updateRecipeDto,
                1,
            );

            expect(mockRecipesRepository.update).toHaveBeenCalledWith(
                {
                    id: 1,
                    user: {
                        id: fakeRequest["user"].userId,
                    },
                },
                updateRecipeDto,
            );

            expect(mockRecipesRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    user: {
                        id: fakeRequest["user"].userId,
                    },
                },
                relations: ["recipeIngredient", "recipeIngredient.ingredient"],
            });

            expect(result).toEqual(fakeUpdatedRecipe);
        });

        it("should change the ingredients of the recipe", async () => {
            const updateIngredientRecipeDto = {
                ingredients: [
                    {
                        ingredientId: 1,
                        quantity: 2,
                        unit: Unit.G,
                    },
                ],
            };

            mockRecipeIngredientRepository.update.mockResolvedValue({
                affected: 1,
            });

            mockRecipesRepository.findOne.mockResolvedValue(fakeRecipes[0]);

            const result = await service.updateRecipe(
                fakeRequest,
                updateIngredientRecipeDto,
                1,
            );

            expect(mockRecipeIngredientRepository.update).toHaveBeenCalledWith(
                {
                    recipeId: fakeRecipes[0].id,
                    ingredientId:
                        updateIngredientRecipeDto.ingredients[0].ingredientId,
                },
                updateIngredientRecipeDto.ingredients[0],
            );

            expect(mockRecipesRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    user: {
                        id: fakeRequest["user"].userId,
                    },
                },
                relations: ["recipeIngredient", "recipeIngredient.ingredient"],
            });

            expect(result).toEqual(fakeRecipes[0]);
        });

        it("should add an ingredient in the recipe", async () => {
            const updateIngredientRecipeDto = {
                ingredients: [
                    {
                        name: "Caffè",
                        quantity: 2,
                        unit: Unit.G,
                    },
                ],
            };
            mockIngredientsService.findOrCreate.mockResolvedValue({
                id: 1,
                name: updateIngredientRecipeDto.ingredients[0].name,
            });

            mockRecipeIngredientRepository.create.mockReturnValue({
                recipeId: fakeRecipes[0].id,
                ingredientId: 1,
                quantity: updateIngredientRecipeDto.ingredients[0].quantity,
                unit: updateIngredientRecipeDto.ingredients[0].unit,
            });

            mockRecipeIngredientRepository.save.mockResolvedValue({
                id: 1,
                recipeId: fakeRecipes[0].id,
                ingredientId: 1,
                quantity: updateIngredientRecipeDto.ingredients[0].quantity,
                unit: updateIngredientRecipeDto.ingredients[0].unit,
            });

            mockRecipesRepository.findOne.mockResolvedValue(fakeRecipes[0]);

            const result = await service.updateRecipe(
                fakeRequest,
                updateIngredientRecipeDto,
                1,
            );

            expect(mockIngredientsService.findOrCreate).toHaveBeenCalledWith(
                updateIngredientRecipeDto.ingredients[0].name,
            );

            expect(mockRecipeIngredientRepository.create).toHaveBeenCalledWith({
                recipeId: fakeRecipes[0].id,
                ingredientId: 1,
                quantity: updateIngredientRecipeDto.ingredients[0].quantity,
                unit: updateIngredientRecipeDto.ingredients[0].unit,
            });

            expect(mockRecipeIngredientRepository.save).toHaveBeenCalledWith({
                recipeId: fakeRecipes[0].id,
                ingredientId: 1,
                quantity: updateIngredientRecipeDto.ingredients[0].quantity,
                unit: updateIngredientRecipeDto.ingredients[0].unit,
            });

            expect(mockRecipesRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    user: {
                        id: fakeRequest["user"].userId,
                    },
                },
                relations: ["recipeIngredient", "recipeIngredient.ingredient"],
            });

            expect(result).toEqual(fakeRecipes[0]);
        });

        it("should remove an ingredient associated with the recipe", async () => {
            const deleteIngredientRecipeDto = {
                ingredients: [
                    {
                        ingredientId: 1,
                        delete: true,
                    },
                ],
            };

            mockRecipeIngredientRepository.delete.mockResolvedValue({
                affected: 1,
            });

            const result = await service.updateRecipe(
                fakeRequest,
                deleteIngredientRecipeDto,
                1,
            );

            expect(mockRecipeIngredientRepository.delete).toHaveBeenCalledWith({
                recipeId: 1,
                ingredientId: 1,
            });

            expect(mockRecipesRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    user: {
                        id: fakeRequest["user"].userId,
                    },
                },
                relations: ["recipeIngredient", "recipeIngredient.ingredient"],
            });

            expect(result).toEqual(fakeRecipes[0]);
        });
    });
});
