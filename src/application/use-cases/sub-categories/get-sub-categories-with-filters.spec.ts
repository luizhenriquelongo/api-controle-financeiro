import { InMemorySubCategoriesRepository } from '../../../../tests/repositories/in-memory-sub-categories-repository';
import { SubCategoryEntity } from '../../../domain/entities/sub-category';
import { GetSubCategoriesWithFiltersUseCase } from './get-sub-categories-with-filters';

describe('Get subcategories with filters use case', () => {
  it('should be able to get subcategories with name filter', async () => {
    const repository = new InMemorySubCategoriesRepository();
    const storedSubCategory = SubCategoryEntity.create({
      subCategoryId: 1,
      categoryId: 1,
      name: 'Subcategoria 1'
    });
    repository.items.push(storedSubCategory);

    const storedSubCategory2 = SubCategoryEntity.create({
      subCategoryId: 2,
      categoryId: 2,
      name: 'Subcategory 2'
    });
    repository.items.push(storedSubCategory2);

    const useCase = new GetSubCategoriesWithFiltersUseCase(repository);

    const response = await useCase.execute({ name: 'Subcategory' });

    expect(response).toStrictEqual([storedSubCategory2]);
  });

  it('should be able to get subcategories with name id', async () => {
    const repository = new InMemorySubCategoriesRepository();
    const storedSubCategory = SubCategoryEntity.create({
      subCategoryId: 1,
      categoryId: 1,
      name: 'Subcategoria 1'
    });
    repository.items.push(storedSubCategory);

    const storedSubCategory2 = SubCategoryEntity.create({
      subCategoryId: 2,
      categoryId: 2,
      name: 'Subcategory 2'
    });
    repository.items.push(storedSubCategory2);

    const useCase = new GetSubCategoriesWithFiltersUseCase(repository);

    const response = await useCase.execute({ subCategoryId: 1 });

    expect(response).toStrictEqual([storedSubCategory]);
  });
});
