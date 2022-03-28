import { InMemoryCategoriesRepository } from '../../../../tests/repositories/in-memory-categories-repository';
import { CategoryEntity } from '../../../domain/entities/category';
import { GetCategoriesWithFiltersUseCase } from './get-categories-with-filters';

describe('Get categories with filters use case', () => {
  it('should be able to get categories with filters', async () => {
    const repository = new InMemoryCategoriesRepository();
    const storedCategory = CategoryEntity.create({
      categoryId: 1,
      name: 'Categoria 1'
    });
    repository.items.push(storedCategory);

    const storedCategory2 = CategoryEntity.create({
      categoryId: 2,
      name: 'Category 2'
    });
    repository.items.push(storedCategory2);

    const useCase = new GetCategoriesWithFiltersUseCase(repository);

    const response = await useCase.execute({ name: 'Category' });

    expect(response).toStrictEqual([storedCategory2]);
  });
});
