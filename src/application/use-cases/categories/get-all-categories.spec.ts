import { InMemoryCategoriesRepository } from '../../../../tests/repositories/in-memory-categories-repository';
import { CategoryEntity } from '../../../domain/entities/category';
import { GetAllCategoriesUseCase } from './get-all-categories';

describe('Get all categories use case', () => {
  it('should be able to get all categories', async () => {
    const repository = new InMemoryCategoriesRepository();
    const storedCategory = CategoryEntity.create({
      categoryId: 1,
      name: 'Category 1'
    });
    repository.items.push(storedCategory);

    const storedCategory2 = CategoryEntity.create({
      categoryId: 2,
      name: 'Category 2'
    });
    repository.items.push(storedCategory2);

    const useCase = new GetAllCategoriesUseCase(repository);

    const response = await useCase.execute();

    expect(response).toStrictEqual([storedCategory, storedCategory2]);
  });
});
