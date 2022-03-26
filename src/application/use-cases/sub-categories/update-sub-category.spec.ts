import { InMemoryCategoriesRepository } from '../../../../tests/repositories/in-memory-categories-repository';
import { CategoryEntity } from '../../../domain/entities/category';
import { UpdateCategoryUseCase } from '../categories/update-category';
import { InMemorySubCategoriesRepository } from '../../../../tests/repositories/in-memory-sub-categories-repository';
import { SubCategoryEntity } from '../../../domain/entities/sub-category';
import { ICategoriesRepository } from '../../repositories/CategoriesRepository';
import { UpdateSubCategoryUseCase } from "./update-sub-category";


describe('Update sub category use case', () => {
  it('should be able to update an existent sub category', async () => {
    const categoriesRepository = new InMemoryCategoriesRepository();
    const subCategoriesRepository = new InMemorySubCategoriesRepository();
    const storedCategory1 = CategoryEntity.create({
      categoryId: 1,
      name: 'Category 1'
    });
    const storedCategory2 = CategoryEntity.create({
      categoryId: 2,
      name: 'Category 2'
    });
    categoriesRepository.items.push(storedCategory1);
    categoriesRepository.items.push(storedCategory2);

    const storedSubCategory = SubCategoryEntity.create({
      subCategoryId: 1,
      categoryId: 1,
      name: 'Sub Category 1'
    });
    subCategoriesRepository.items.push(storedSubCategory);

    expect(subCategoriesRepository.items.length).toBe(1);
    expect(categoriesRepository.items.length).toBe(2);
    expect(subCategoriesRepository.items[0]).toStrictEqual(storedSubCategory);
    expect(categoriesRepository.items[0]).toStrictEqual(storedCategory1);
    expect(categoriesRepository.items[1]).toStrictEqual(storedCategory2);

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
    const categoriesRepository = new InMemoryCategoriesRepository();
    const subCategoriesRepository = new InMemorySubCategoriesRepository();
    const storedCategory1 = CategoryEntity.create({
      categoryId: 1,
      name: 'Category 1'
    });
    categoriesRepository.items.push(storedCategory1);

    const storedSubCategory = SubCategoryEntity.create({
      subCategoryId: 1,
      categoryId: 1,
      name: 'Sub Category 1'
    });
    subCategoriesRepository.items.push(storedSubCategory);

    expect(subCategoriesRepository.items.length).toBe(1);
    expect(categoriesRepository.items.length).toBe(2);
    expect(subCategoriesRepository.items[0]).toStrictEqual(storedSubCategory);
    expect(categoriesRepository.items[0]).toStrictEqual(storedCategory1);
    expect(categoriesRepository.items[1]).toStrictEqual(storedCategory2);

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

    await expect(async () => {
      await useCase.execute({
        categoryId: 2,
        name: 'Category 2'
      });
    }).rejects.toThrow("Can't update category because category do not exists.");
    expect(repository.items.length).toBe(1);
    expect(repository.items[0]).toStrictEqual(stored_category);
  });
});
