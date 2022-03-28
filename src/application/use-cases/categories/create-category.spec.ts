import { InMemoryCategoriesRepository } from '../../../../tests/repositories/in-memory-categories-repository';
import { CreateCategoryUseCase } from './create-category';

describe('Create category use case', () => {
  it('should be able to create a new category', async () => {
    const repository = new InMemoryCategoriesRepository();

    const useCase = new CreateCategoryUseCase(repository);

    expect(repository.items.length).toBe(0);

    const response = await useCase.execute({
      name: 'Category 1'
    });

    expect(response).toBeTruthy();
    expect(repository.items.length).toBe(1);
  });
});
