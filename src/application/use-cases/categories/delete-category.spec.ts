import { InMemoryCategoriesRepository } from '../../../../tests/repositories/in-memory-categories-repository';
import { CategoryEntity } from '../../../domain/entities/category';
import { DeleteCategoryUseCase } from './delete-category';
import APIException from '../../exceptions/api.exception';

describe('Delete category use case', () => {
  it('should be able to delete an existent category', async () => {
    const repository = new InMemoryCategoriesRepository();
    const storedCategory = CategoryEntity.create({
      categoryId: 1,
      name: 'Category 1'
    });
    repository.items.push(storedCategory);

    expect(repository.items.length).toBe(1);

    const useCase = new DeleteCategoryUseCase(repository);

    await useCase.execute({ categoryId: 1 });

    expect(repository.items.length).toBe(0);
  });

  test('should throw an error if no category was found', async () => {
    const repository = new InMemoryCategoriesRepository();
    const storedCategory = CategoryEntity.create({
      categoryId: 1,
      name: 'Category 1'
    });
    repository.items.push(storedCategory);

    expect(repository.items.length).toBe(1);
    const useCase = new DeleteCategoryUseCase(repository);
    const result = await useCase.execute({ categoryId: 2 });
    expect(result).toBeInstanceOf(APIException);
    expect(repository.items.length).toBe(1);
  });
});
