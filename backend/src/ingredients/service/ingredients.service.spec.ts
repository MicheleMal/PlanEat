import { Test, TestingModule } from "@nestjs/testing";
import { IngredientsService } from "./ingredients.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Ingredient } from "../entity/ingredient.entity";

describe("IngredientsService", () => {
    let service: IngredientsService;

    const fakeIngredients = [
        {
            id: 1,
            name: "Pomodoro",
        },
        {
            id: 2,
            name: "Pasta",
        },
    ];

    const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
        getOne: jest.fn(),
    };

    const mockIngredientRepository = {
        createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
        create: jest.fn(),
        save: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                IngredientsService,
                {
                    provide: getRepositoryToken(Ingredient),
                    useValue: mockIngredientRepository,
                },
            ],
        }).compile();

        service = module.get<IngredientsService>(IngredientsService);

        jest.clearAllMocks();
    });

    describe("getIngredients", () => {
        it("should return ingredients starting with given name", async () => {
            mockQueryBuilder.getMany.mockResolvedValue(fakeIngredients);

            const result = await service.getIngredients("pom");

            expect(
                mockIngredientRepository.createQueryBuilder,
            ).toHaveBeenCalledWith("ing");

            expect(mockQueryBuilder.where).toHaveBeenCalledWith(
                "LOWER(ing.name) LIKE LOWER(:name)",
                { name: "pom%" },
            );

            expect(mockQueryBuilder.getMany).toHaveBeenCalled();
            expect(result).toEqual(fakeIngredients);
        });

        it("should return empty array starting with given name", async () => {
            mockQueryBuilder.getMany.mockResolvedValue([]);

            const result = await service.getIngredients("test");

            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });
    });

    describe("findOrCreate", () => {
        it("should create an ingredient if it doesn't exist", async () => {
            const fakeNewIngredient = {
                name: "Caffè",
            };
            const fakeSavedIngredient = {
                id: 1,
                ...fakeNewIngredient,
            };

            mockQueryBuilder.getOne.mockResolvedValue(null);
            mockIngredientRepository.create.mockReturnValue(fakeNewIngredient);
            mockIngredientRepository.save.mockResolvedValue(
                fakeSavedIngredient,
            );

            const result = await service.findOrCreate(fakeNewIngredient.name);

            expect(
                mockIngredientRepository.createQueryBuilder,
            ).toHaveBeenCalledWith("ing");

            expect(mockQueryBuilder.where).toHaveBeenCalledWith(
                "LOWER(ing.name) = LOWER(:name)",
                { name: fakeNewIngredient.name },
            );

            expect(mockIngredientRepository.create).toHaveBeenCalledWith({
                name: fakeNewIngredient.name,
            });
            expect(mockIngredientRepository.save).toHaveBeenCalledWith(
                fakeNewIngredient,
            );

            expect(result).toEqual(fakeNewIngredient);
        });

        it("should return an ingredient if it exist", async () => {
            mockQueryBuilder.getOne.mockResolvedValue(fakeIngredients[0]);

            const result = await service.findOrCreate("Pomodoro");

            expect(
                mockIngredientRepository.createQueryBuilder,
            ).toHaveBeenCalledWith("ing");

            expect(mockQueryBuilder.where).toHaveBeenCalledWith(
                "LOWER(ing.name) = LOWER(:name)",
                { name: "Pomodoro" },
            );
            expect(mockQueryBuilder.getOne).toHaveBeenCalled();

            expect(mockIngredientRepository.create).not.toHaveBeenCalled();
            expect(mockIngredientRepository.save).not.toHaveBeenCalled();

            expect(result).toEqual(fakeIngredients[0]);
        });
    });
});
