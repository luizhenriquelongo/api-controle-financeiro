import { getInMemorySubCategoriesRepository } from '../../../../tests/repositories/utils';
import { SubCategoryEntity } from '../../../domain/entities/sub-category';
import { DeleteSubCategoryUseCase } from './delete-sub-category';
import APIException from '../../exceptions/api.exception';

describe('Delete sub category use case', () => {
  it('should be able to delete an existent sub category', async () => {
    const storedSubCategory = SubCategoryEntity.create({
      subCategoryId: 1,
      categoryId: 1,
      name: 'Sub Category 1'
    });
    const repository = await getInMemorySubCategoriesRepository([
      storedSubCategory
    ]);

    expect(repository.items.length).toBe(1);

    const useCase = new DeleteSubCategoryUseCase(repository);
    await useCase.execute({ subCategoryId: 1 });

    expect(repository.items.length).toBe(0);
  });

  test('should throw an error if no sub category was found', async () => {
    const storedSubCategory = SubCategoryEntity.create({
      subCategoryId: 1,
      categoryId: 1,
      name: 'Sub Category 1'
    });
    const repository = await getInMemorySubCategoriesRepository([
      storedSubCategory
    ]);

    expect(repository.items.length).toBe(1);
    const useCase = new DeleteSubCategoryUseCase(repository);

    const result = await useCase.execute({ subCategoryId: 2 });
    expect(result).toBeInstanceOf(APIException);
    expect(repository.items.length).toBe(1);
  });
});
