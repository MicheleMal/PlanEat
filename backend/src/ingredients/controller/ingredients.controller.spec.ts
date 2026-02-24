import { Test, TestingModule } from '@nestjs/testing';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from '../service/ingredients.service';

describe('IngredientsController', () => {
  let controller: IngredientsController;

  const mockIngredientsService = {
    getIngredients: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngredientsController],
      providers: [
        {
          provide: IngredientsService,
          useValue: mockIngredientsService
        }
      ]
    }).compile();

    controller = module.get<IngredientsController>(IngredientsController);
  });

  it('should call service get ingredients', async () => {
    const fakeIngredient = [
      {id: 1, name: "Pomodoro"}
    ]

    mockIngredientsService.getIngredients.mockResolvedValue(fakeIngredient)

    const result = await controller.getIngredients(fakeIngredient[0].name)

    expect(mockIngredientsService.getIngredients).toHaveBeenCalledWith(fakeIngredient[0].name)

    expect(result).toEqual(fakeIngredient)
  });
});
