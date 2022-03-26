import { getInMemorySubCategoriesRepository } from '../../../../tests/repositories/utils';
import { SubCategoryEntity } from '../../../domain/entities/sub-category';
import { GetSubCategoryUseCase } from './get-sub-category';

describe('Get sub category use case', () => {
  it('should be able to get a sub category', async () => {
    const storedSubCategory = SubCategoryEntity.create({
      subCategoryId: 1,
      categoryId: 1,
      name: 'Sub Category Name'
    });
    const repository = await getInMemorySubCategoriesRepository([
      storedSubCategory
    ]);

    const useCase = new GetSubCategoryUseCase(repository);

    const response = await useCase.execute({
      subCategoryId: 1
    });

    expect(response).toBe(storedSubCategory);
  });

  test('should throw an error if no category was found', async () => {
    const repository = await getInMemorySubCategoriesRepository([]);

    const useCase = new GetSubCategoryUseCase(repository);

    await expect(async () => {
      await useCase.execute({ subCategoryId: 1 });
    }).rejects.toThrow('Sub category not found.');
  });
});
