import { InMemoryCategoriesRepository } from '../../../../tests/repositories/in-memory-categories-repository';
import { CategoryEntity } from '../../../domain/entities/category';
import { GetCategoryUseCase } from './get-category';

describe('Get category use case', () => {
  it('should be able to get a category', async () => {
    const repository = new InMemoryCategoriesRepository();
    const stored_category = CategoryEntity.create({
      categoryId: 1,
      name: 'Category Name'
    });
    repository.items.push(stored_category);

    const useCase = new GetCategoryUseCase(repository);

    const response = await useCase.execute({
      categoryId: 1
    });

    expect(response).toBe(stored_category);
  });

  test('should throw an error if no category was found', async () => {
    const repository = new InMemoryCategoriesRepository();
    const stored_category = CategoryEntity.create({
      categoryId: 1,
      name: 'Category Name'
    });
    repository.items.push(stored_category);

    const useCase = new GetCategoryUseCase(repository);

    await expect(async () => {
      await useCase.execute({ categoryId: 2 });
    }).rejects.toThrow('Category not found.');
  });
});
