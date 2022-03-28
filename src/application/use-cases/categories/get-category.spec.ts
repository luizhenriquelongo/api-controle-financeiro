import { InMemoryCategoriesRepository } from '../../../../tests/repositories/in-memory-categories-repository';
import { CategoryEntity } from '../../../domain/entities/category';
import { GetCategoryUseCase } from './get-category';
import APIException from "../../exceptions/api.exception";

describe('Get category use case', () => {
  it('should be able to get a category', async () => {
    const repository = new InMemoryCategoriesRepository();
    const storedCategory = CategoryEntity.create({
      categoryId: 1,
      name: 'Category Name'
    });
    repository.items.push(storedCategory);

    const useCase = new GetCategoryUseCase(repository);

    const response = await useCase.execute({
      categoryId: 1
    });

    expect(response).toBe(storedCategory);
  });

  test('should throw an error if no category was found', async () => {
    const repository = new InMemoryCategoriesRepository();
    const stored_category = CategoryEntity.create({
      categoryId: 1,
      name: 'Category Name'
    });
    repository.items.push(stored_category);

    const useCase = new GetCategoryUseCase(repository);

    const result = await useCase.execute({ categoryId: 2 });
    expect(result).toBeInstanceOf(APIException);
  });
});
