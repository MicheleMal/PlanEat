import { Test, TestingModule } from "@nestjs/testing";
import { MealsController } from "./meals.controller";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { MealsService } from "../service/meals.service";
import { MealType } from "../enum/mealType.enum";

describe("MealsController", () => {
    let controller: MealsController;

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
            user: {
                id: fakeRequest["user"].userId
            }
        },
    ];

    const mockMealsService = {
        createMeal: jest.fn(),
        getAllMeals: jest.fn(),
        getMealById: jest.fn(),
        updateMeal: jest.fn(),
        deleteMeal: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MealsController],
            providers: [
                {
                    provide: MealsService,
                    useValue: mockMealsService,
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        controller = module.get<MealsController>(MealsController);
    });

    it("should be call service create meal", async () => {
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

        mockMealsService.createMeal.mockResolvedValue(fakeSavedMeal);

        const result = await controller.createMeal(fakeRequest, createMealDto);

        expect(mockMealsService.createMeal).toHaveBeenCalledWith(fakeRequest, createMealDto)
        expect(result).toEqual(fakeSavedMeal)
    });

    it("should be call service get all meals", async ()=>{
        const startDate = new Date("2025-01-01")
        const endDate = new Date("2025-12-31")
        mockMealsService.getAllMeals.mockResolvedValue(fakeMeals)

        const result = await controller.getAllMeals(fakeRequest, startDate, endDate)

        expect(mockMealsService.getAllMeals).toHaveBeenCalledWith(fakeRequest, startDate, endDate)
        expect(result).toEqual(fakeMeals)
    })

    it("should be call service get meal by id", async ()=>{
        mockMealsService.getMealById.mockResolvedValue(fakeMeals[0])

        const result = await controller.getMealById(fakeRequest, 1)

        expect(mockMealsService.getMealById).toHaveBeenCalledWith(fakeRequest, 1)
        expect(result).toEqual(fakeMeals[0])
    })

    it("should be call service update meal", async()=>{
        const updateMealDto = {
            mealType: MealType.MERENDA,
            recipes: [
                {id: 1}
            ]
        }

        mockMealsService.updateMeal.mockResolvedValue({
            ...fakeMeals[0],
            mealType: updateMealDto.mealType
        })

        const result = await controller.updateMeal(fakeRequest, 1, updateMealDto)

        expect(mockMealsService.updateMeal).toHaveBeenCalledWith(fakeRequest, 1, updateMealDto)
        expect(result).toEqual({
            ...fakeMeals[0],
            mealType: updateMealDto.mealType
        })
    })

    it("should be call service delete meal", async()=>{
        mockMealsService.deleteMeal.mockResolvedValue(true)

        const result = await controller.deleteMeal(fakeRequest, 1)

        expect(mockMealsService.deleteMeal).toHaveBeenCalledWith(fakeRequest, 1)
        expect(result).toBe(true)
    })

});
