import { getInMemorySubCategoriesRepository } from '../../../../tests/repositories/utils';
import { SubCategoryEntity } from '../../../domain/entities/sub-category';
import { GetAllSubCategoriesUseCase } from './get-all-sub-categories';

describe('Get all categories use case', () => {
  it('should be able to get all categories', async () => {
    const storedSubCategory = SubCategoryEntity.create({
      subCategoryId: 1,
      categoryId: 1,
      name: 'Sub Category 1'
    });
    const storedSubCategory2 = SubCategoryEntity.create({
      subCategoryId: 2,
      categoryId: 1,
      name: 'Sub Category 2'
    });

    const repository = await getInMemorySubCategoriesRepository([
      storedSubCategory,
      storedSubCategory2
    ]);

    const useCase = new GetAllSubCategoriesUseCase(repository);

    const response = await useCase.execute();

    expect(response).toStrictEqual([storedSubCategory, storedSubCategory2]);
  });
});
