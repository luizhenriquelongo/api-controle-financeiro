import { EntryEntity } from '../../../domain/entities/entry';
import {
  getInMemoryCategoriesRepository,
  getInMemoryEntriesRepository,
  getInMemorySubCategoriesRepository
} from '../../../../tests/repositories/utils';
import { CategoryEntity } from '../../../domain/entities/category';
import { SubCategoryEntity } from '../../../domain/entities/sub-category';
import { GetBalanceByPeriodAndCategoryUseCase } from './get-balance-by-period-and-category';

const loadEntries = (): EntryEntity[] => {
  const storedEntry1 = EntryEntity.create({
    entryId: 1,
    value: 100,
    date: new Date(2022, 3, 24),
    subCategoryId: 1,
    comment: 'some comment'
  });
  const storedEntry2 = EntryEntity.create({
    entryId: 2,
    value: -90,
    date: new Date(2022, 3, 25),
    subCategoryId: 2,
    comment: 'some comment'
  });
  const storedEntry3 = EntryEntity.create({
    entryId: 3,
    value: 50,
    date: new Date(2022, 3, 26),
    subCategoryId: 3,
    comment: 'some comment'
  });

  return [storedEntry1, storedEntry2, storedEntry3];
};

const loadCategories = () => {
  const storedCategory1 = CategoryEntity.create({
    categoryId: 1,
    name: 'Category 1'
  });
  const storedCategory2 = CategoryEntity.create({
    categoryId: 2,
    name: 'Category 2'
  });
  return [storedCategory1, storedCategory2];
};

const loadSubCategories = () => {
  const storedSubCategory1 = SubCategoryEntity.create({
    subCategoryId: 1,
    categoryId: 1,
    name: 'Sub Category 1'
  });
  const storedSubCategory2 = SubCategoryEntity.create({
    subCategoryId: 2,
    categoryId: 1,
    name: 'Sub Category 2'
  });
  const storedSubCategory3 = SubCategoryEntity.create({
    subCategoryId: 3,
    categoryId: 2,
    name: 'Sub Category 3'
  });

  return [storedSubCategory1, storedSubCategory2, storedSubCategory3];
};

describe('Get balance by period and category use case', () => {
  it('should be able to get a balance', async () => {
    const entriesRepository = await getInMemoryEntriesRepository(loadEntries());
    const categoriesRepository = await getInMemoryCategoriesRepository(
      loadCategories()
    );
    const subCategoriesRepository = await getInMemorySubCategoriesRepository(
      loadSubCategories()
    );
    const useCase = new GetBalanceByPeriodAndCategoryUseCase(
      entriesRepository,
      categoriesRepository,
      subCategoriesRepository
    );

    const response = await useCase.execute({
      startDate: new Date(2022, 3, 24),
      endDate: new Date(2022, 3, 26),
      categoryId: 1
    });

    expect(response.props.expense).toBe(-90);
    expect(response.props.income).toBe(100);
    expect(response.props.balance).toBe(10);
    expect(response.props.category).toStrictEqual({
      categoryId: 1,
      name: 'Category 1'
    });
  });

  it('should be able to get a balance filtering', async () => {
    const entriesRepository = await getInMemoryEntriesRepository(loadEntries());
    const categoriesRepository = await getInMemoryCategoriesRepository(
      loadCategories()
    );
    const subCategoriesRepository = await getInMemorySubCategoriesRepository(
      loadSubCategories()
    );
    const useCase = new GetBalanceByPeriodAndCategoryUseCase(
      entriesRepository,
      categoriesRepository,
      subCategoriesRepository
    );

    const response = await useCase.execute({
      startDate: new Date(2022, 3, 25),
      endDate: new Date(2022, 3, 26),
      categoryId: 1
    });

    expect(response.props.expense).toBe(-90);
    expect(response.props.income).toBe(0);
    expect(response.props.balance).toBe(-90);
    expect(response.props.category).toStrictEqual({
      categoryId: 1,
      name: 'Category 1'
    });
  });
});
