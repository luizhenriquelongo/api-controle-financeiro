import {
  getInMemoryCategoriesRepository,
  getInMemorySubCategoriesRepository
} from '../../../../tests/repositories/utils';
import { CreateSubCategoryUseCase } from './create-sub-category';
import { CategoryEntity } from '../../../domain/entities/category';

describe('Create sub category use case', () => {
  it('should be able to create a new sub category', async () => {
    const storedCategory = CategoryEntity.create({
      categoryId: 1,
      name: 'Category 1'
    });

    const subCategoriesRepository = await getInMemorySubCategoriesRepository(
      []
    );
    const categoriesRepository = await getInMemoryCategoriesRepository([
      storedCategory
    ]);

    const useCase = new CreateSubCategoryUseCase(
      categoriesRepository,
      subCategoriesRepository
    );

    expect(subCategoriesRepository.items.length).toBe(0);

    const response = await useCase.execute({
      subCategoryId: 1,
      categoryId: 1,
      name: 'Sub Category 1'
    });

    expect(response.props.name).toBe('Sub Category 1');
    expect(response.props.subCategoryId).toBe(1);
    expect(response.props.categoryId).toBe(1);
    expect(subCategoriesRepository.items.length).toBe(1);
  });

  it('should throw an error if no category was found', async () => {
    const subCategoriesRepository = await getInMemorySubCategoriesRepository(
      []
    );
    const categoriesRepository = await getInMemoryCategoriesRepository([]);

    const useCase = new CreateSubCategoryUseCase(
      categoriesRepository,
      subCategoriesRepository
    );

    expect(subCategoriesRepository.items.length).toBe(0);

    await expect(async () => {
      await useCase.execute({
        subCategoryId: 1,
        categoryId: 1,
        name: 'Sub Category 1'
      });
    }).rejects.toThrow(
      "Can't create a sub category: category id 1 does not exists."
    );
    expect(subCategoriesRepository.items.length).toBe(0);
    expect(categoriesRepository.items.length).toBe(0);
  });
});
