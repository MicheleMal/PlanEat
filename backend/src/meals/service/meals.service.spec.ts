import { Test, TestingModule } from "@nestjs/testing";
import { MealsService } from "./meals.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { MealRecipe } from "../entity/mealRecipe.entity";
import { Meal } from "../entity/meal.entity";
import { MealType } from "../enum/mealType.enum";
import { Between } from "typeorm";

describe("MealsService", () => {
    let service: MealsService;

    const fakeRequest = {
        user: {
            userId: 1,
        },
    } as unknown as Request;

    const fakeMeals = [
        {
            id: 1,
            date: new Date("2028-02-26"),
            mealType: MealType.APERITIVO,
            createdAt: "2028-02-26",
            updateAt: "2028-02-26",
        },
    ];

    const mockMealRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    const mockMealRecipeRepository = {
        create: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MealsService,
                {
                    provide: getRepositoryToken(Meal),
                    useValue: mockMealRepository,
                },
                {
                    provide: getRepositoryToken(MealRecipe),
                    useValue: mockMealRecipeRepository,
                },
            ],
        }).compile();

        service = module.get<MealsService>(MealsService);

        jest.clearAllMocks();
    });

    describe("createMeal", () => {
        it("should be create a new meal", async () => {
            const createMealDto = {
                date: new Date("2026-02-26"),
                mealType: MealType.CENA,
                recipes: [{ id: 1 }],
            };

            const fakeSavedMeal = {
                id: 1,
                ...createMealDto,
                createdAt: "2026-02-26",
                updateAt: "2026-02-26",
                user: {
                    id: fakeRequest["user"].userId,
                },
            };

            const fakeSavedMealRecipe = {
                mealId: fakeSavedMeal.id,
                recipeId: createMealDto.recipes[0].id,
            };

            mockMealRepository.create.mockReturnValue(fakeSavedMeal);
            mockMealRepository.save.mockResolvedValue(fakeSavedMeal);

            mockMealRecipeRepository.create.mockReturnValue(
                fakeSavedMealRecipe,
            );

            mockMealRecipeRepository.save.mockResolvedValue(
                fakeSavedMealRecipe,
            );

            const result = await service.createMeal(fakeRequest, createMealDto);

            expect(mockMealRepository.create).toHaveBeenCalledWith({
                ...createMealDto,
                user: {
                    id: fakeRequest["user"].userId,
                },
            });
            expect(mockMealRepository.save).toHaveBeenCalledWith(fakeSavedMeal);

            expect(mockMealRecipeRepository.create).toHaveBeenCalledWith(
                fakeSavedMealRecipe,
            );
            expect(mockMealRecipeRepository.save).toHaveBeenCalledWith(
                fakeSavedMealRecipe,
            );

            expect(result).toEqual(fakeSavedMeal);
        });
    });

    describe("getAllMeals", () => {
        it("should return all meals for the logged in user", async () => {
            mockMealRepository.find.mockResolvedValue(fakeMeals);

            const result = await service.getAllMeals(fakeRequest);

            expect(mockMealRepository.find).toHaveBeenCalledWith({
                where: {
                    user: {
                        id: fakeRequest["user"].userId,
                    },
                },
                relations: ["mealRecipe", "mealRecipe.recipe"],
            });

            expect(result).toEqual(fakeMeals);
        });

        it("should return all meals for the date range (startDate - endDate) of the logged in user", async () => {
            const startDate = new Date("2025-01-01");
            const endDate = new Date("2025-12-31");

            mockMealRepository.find.mockResolvedValue(fakeMeals);

            const result = await service.getAllMeals(
                fakeRequest,
                startDate,
                endDate,
            );

            expect(mockMealRepository.find).toHaveBeenCalledWith({
                where: {
                    user: {
                        id: fakeRequest["user"].userId,
                    },
                    date: expect.any(Object),
                },
                order: {
                    date: "ASC",
                    mealType: "ASC",
                },
                relations: [
                    "mealRecipe",
                    "mealRecipe.recipe",
                    "mealRecipe.recipe.recipeIngredient",
                ],
            });

            expect(result).toEqual(fakeMeals);
        });
    });

    describe("getMealById", () => {
        it("It should return a certain meal", async () => {
            mockMealRepository.findOne.mockResolvedValue(fakeMeals[0]);

            const result = await service.getMealById(fakeRequest, 1);

            expect(mockMealRepository.findOne).toHaveBeenCalledWith({
                where: {
                    user: {
                        id: fakeRequest["user"].userId,
                    },
                    id: 1,
                },
                relations: ["mealRecipe", "mealRecipe.recipe"],
            });

            expect(result).toEqual(fakeMeals[0]);
        });

        it("It should return empty array", async () => {
            mockMealRepository.findOne.mockResolvedValue([]);

            const result = await service.getMealById(fakeRequest, 1);

            expect(mockMealRepository.findOne).toHaveBeenCalledWith({
                where: {
                    user: {
                        id: fakeRequest["user"].userId,
                    },
                    id: 1,
                },
                relations: ["mealRecipe", "mealRecipe.recipe"],
            });

            expect(result).toEqual([]);
        });
    });

    describe("updateMeal", () => {
        it("should change the meal fields: data and mealType", async () => {
            const updateMealDto = {
                mealType: MealType.MERENDA,
            };

            mockMealRepository.update.mockResolvedValue({
                affected: 1,
            });

            mockMealRepository.findOne.mockResolvedValue({
                ...fakeMeals[0],
                mealType: updateMealDto.mealType,
            });

            const result = await service.updateMeal(
                fakeRequest,
                1,
                updateMealDto,
            );

            expect(mockMealRepository.update).toHaveBeenCalledWith(
                {
                    id: 1,
                    user: {
                        id: fakeRequest["user"].userId,
                    },
                },
                updateMealDto,
            );

            expect(mockMealRepository.findOne).toHaveBeenCalledWith({
                where: {
                    user: {
                        id: fakeRequest["user"].userId,
                    },
                    id: 1,
                },
                relations: ["mealRecipe", "mealRecipe.recipe"],
            });

            expect(result).toEqual({
                ...fakeMeals[0],
                mealType: updateMealDto.mealType,
            });
        });

        it("should remove an recipe associated with the meal", async () => {
            const deleteRecipeMealDto = {
                recipes: [{ id: 1 }],
            };

            mockMealRecipeRepository.delete.mockResolvedValue({
                affected: 1,
            });

            mockMealRepository.findOne.mockResolvedValue(fakeMeals[0]);

            const result = await service.updateMeal(
                fakeRequest,
                1,
                deleteRecipeMealDto,
            );

            expect(mockMealRecipeRepository.delete).toHaveBeenCalledWith({
                mealId: 1,
                recipeId: deleteRecipeMealDto.recipes[0].id,
            });

            expect(mockMealRepository.findOne).toHaveBeenCalledWith({
                where: {
                    user: {
                        id: fakeRequest["user"].userId,
                    },
                    id: 1,
                },
                relations: ["mealRecipe", "mealRecipe.recipe"],
            });

            expect(mockMealRepository.update).not.toHaveBeenCalled();

            expect(result).toEqual(fakeMeals[0]);
        });

        it("should update meal", async () => {
            const updateMealDto = {
                mealType: MealType.MERENDA,
                recipes: [{ id: 1 }],
            };
            const { recipes, ...mealFields } = updateMealDto;
            mockMealRepository.update.mockResolvedValue({
                affected: 1,
            });
            mockMealRecipeRepository.delete.mockResolvedValue({
                affected: 1,
            });
            mockMealRepository.findOne.mockResolvedValue({
                ...fakeMeals[0],
                mealType: updateMealDto.mealType,
            });

            const result = await service.updateMeal(
                fakeRequest,
                1,
                updateMealDto,
            );

            expect(mockMealRepository.update).toHaveBeenCalledWith(
                {
                    id: 1,
                    user: {
                        id: fakeRequest["user"].userId,
                    },
                },
                mealFields,
            );

            expect(mockMealRecipeRepository.delete).toHaveBeenCalledWith({
                mealId: 1,
                recipeId: recipes[0].id,
            });
            expect(mockMealRepository.findOne).toHaveBeenCalledWith({
                where: {
                    user: {
                        id: fakeRequest["user"].userId,
                    },
                    id: 1,
                },
                relations: ["mealRecipe", "mealRecipe.recipe"],
            });

            expect(result).toEqual({
                ...fakeMeals[0],
                mealType: updateMealDto.mealType
            })
        });
    });

    describe("deleteMeal", () => {
        it("should delete a specific meal", async () => {
            mockMealRepository.delete.mockResolvedValue({
                affected: 1,
            });

            const result = await service.deleteMeal(fakeRequest, 1);

            expect(mockMealRepository.delete).toHaveBeenCalledWith({
                id: 1,
                user: {
                    id: fakeRequest["user"].userId,
                },
            });

            expect(result).toBe(true);
        });
    });
});
