import { InMemoryCategoriesRepository } from '../../../../tests/repositories/in-memory-categories-repository';
import { CategoryEntity } from '../../../domain/entities/category';
import { UpdateCategoryUseCase } from './update-category';

describe('Update category use case', () => {
  it('should be able to update an existent category', async () => {
    const repository = new InMemoryCategoriesRepository();
    const stored_category = CategoryEntity.create({
      categoryId: 1,
      name: 'Category 1'
    });
    repository.items.push(stored_category);

    expect(repository.items.length).toBe(1);
    expect(repository.items[0]).toStrictEqual(stored_category);

    const useCase = new UpdateCategoryUseCase(repository);

    const response = await useCase.execute({
      categoryId: 1,
      name: 'Category 2'
    });

    expect(repository.items.length).toBe(1);
    expect(response.props.name).toBe('Category 2');
  });

  test('should throw an error if no category was found', async () => {
    const repository = new InMemoryCategoriesRepository();
    const storedCategory = CategoryEntity.create({
      categoryId: 1,
      name: 'Category 1'
    });
    repository.items.push(storedCategory);

    expect(repository.items.length).toBe(1);
    const useCase = new UpdateCategoryUseCase(repository);

    await expect(async () => {
      await useCase.execute({
        categoryId: 2,
        name: 'Category 2'
      });
    }).rejects.toThrow("Can't update category because category do not exists.");
    expect(repository.items.length).toBe(1);
    expect(repository.items[0]).toStrictEqual(storedCategory);
  });
});
