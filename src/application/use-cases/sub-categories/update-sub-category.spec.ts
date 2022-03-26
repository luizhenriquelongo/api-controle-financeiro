import { CategoryEntity } from '../../../domain/entities/category';
import { SubCategoryEntity } from '../../../domain/entities/sub-category';
import { UpdateSubCategoryUseCase } from './update-sub-category';
import {
  getInMemoryCategoriesRepository,
  getInMemorySubCategoriesRepository
} from '../../../../tests/repositories/utils';

describe('Update sub category use case', () => {
  it('should be able to update an existent sub category', async () => {
    const storedCategory1 = CategoryEntity.create({
      categoryId: 1,
      name: 'Category 1'
    });
    const storedCategory2 = CategoryEntity.create({
      categoryId: 2,
      name: 'Category 2'
    });

    const storedSubCategory = SubCategoryEntity.create({
      subCategoryId: 1,
      categoryId: 1,
      name: 'Sub Category 1'
    });
    const categoriesRepository = await getInMemoryCategoriesRepository([
      storedCategory1,
      storedCategory2
    ]);
    const subCategoriesRepository = await getInMemorySubCategoriesRepository([
      storedSubCategory
    ]);

    const useCase = new UpdateSubCategoryUseCase(
      categoriesRepository,
      subCategoriesRepository
    );

    const response = await useCase.execute({
      subCategoryId: 1,
      categoryId: 2,
      name: 'Sub Category 2'
    });

    expect(subCategoriesRepository.items.length).toBe(1);
    expect(response.props.name).toBe('Sub Category 2');
    expect(response.props.categoryId).toBe(storedCategory2.props.categoryId);
  });

  test('should throw an error if no category was found', async () => {
    const storedCategory = CategoryEntity.create({
      categoryId: 1,
      name: 'Category 1'
    });

    const storedSubCategory = SubCategoryEntity.create({
      subCategoryId: 1,
      categoryId: 1,
      name: 'Sub Category 1'
    });
    const categoriesRepository = await getInMemoryCategoriesRepository([
      storedCategory
    ]);
    const subCategoriesRepository = await getInMemorySubCategoriesRepository([
      storedSubCategory
    ]);

    const useCase = new UpdateSubCategoryUseCase(
      categoriesRepository,
      subCategoriesRepository
    );

    await expect(async () => {
      await useCase.execute({
        subCategoryId: 1,
        categoryId: 2,
        name: 'Sub Category 2'
      });
    }).rejects.toThrow(
      "Can't update a sub category: category id 2 does not exists."
    );
    expect(subCategoriesRepository.items[0]).toStrictEqual(storedSubCategory);
  });

  test('should throw an error if no sub category was found', async () => {
    const storedCategory = CategoryEntity.create({
      categoryId: 1,
      name: 'Category 1'
    });

    const storedSubCategory = SubCategoryEntity.create({
      subCategoryId: 1,
      categoryId: 1,
      name: 'Sub Category 1'
    });

    const categoriesRepository = await getInMemoryCategoriesRepository([
      storedCategory
    ]);
    const subCategoriesRepository = await getInMemorySubCategoriesRepository([
      storedSubCategory
    ]);

    const useCase = new UpdateSubCategoryUseCase(
      categoriesRepository,
      subCategoriesRepository
    );

    await expect(async () => {
      await useCase.execute({
        subCategoryId: 2,
        name: 'Sub Category 3'
      });
    }).rejects.toThrow(
      "Can't update sub category:  sub category id 2 does not exists."
    );
    expect(subCategoriesRepository.items[0]).toStrictEqual(storedSubCategory);
  });
});
