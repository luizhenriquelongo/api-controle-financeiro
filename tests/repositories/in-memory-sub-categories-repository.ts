import { GetSubCategoriesFilter } from '../../src/application/use-cases/sub-categories/types';

import {
  ISubCategoriesRepository,
  UpdateSubCategoryProps
} from '../../src/application/repositories/sub-categories.repository';
import {
  SubCategoryEntity,
  SubCategoryProps
} from '../../src/domain/entities/sub-category';

export class InMemorySubCategoriesRepository
  implements ISubCategoriesRepository
{
  public items: SubCategoryEntity[] = [];

  async getSubCategoriesWithFilters(
    filters: GetSubCategoriesFilter
  ): Promise<SubCategoryEntity[]> {
    const filteringFunctions = {
      subCategoryId: (
        filters: GetSubCategoriesFilter,
        subCategory: SubCategoryEntity
      ) => subCategory.props.subCategoryId === filters.subCategoryId,
      name: (filters: GetSubCategoriesFilter, subCategory: SubCategoryEntity) =>
        subCategory.props.name.includes(<string>filters.name)
    };

    return this.items.filter((subCategory) => {
      const results: boolean[] = [];
      if (filters.name)
        results.push(filteringFunctions.name(filters, subCategory));
      if (filters.subCategoryId)
        results.push(filteringFunctions.subCategoryId(filters, subCategory));
      return results.every(Boolean);
    });
  }

  async createSubCategory({
    categoryId,
    name
  }: SubCategoryProps): Promise<SubCategoryEntity> {
    const subCategoryId =
      this.items.length > 0 ? this.items[-1].props.subCategoryId + 1 : 1;

    const subCategory = SubCategoryEntity.create({
      subCategoryId,
      categoryId,
      name
    });
    this.items.push(subCategory);

    return subCategory;
  }

  async findSubCategoryById(
    subCategoryId: number
  ): Promise<SubCategoryEntity | null> {
    const subCategory = this.items.find(
      (subCategory) => subCategory.props.subCategoryId === subCategoryId
    );

    if (!subCategory) return null;

    return subCategory;
  }

  async getAllSubCategories(): Promise<SubCategoryEntity[]> {
    return this.items;
  }

  async deleteSubCategoryById(subCategoryId: number): Promise<void> {
    this.items = this.items.filter(
      (subCategory) => subCategory.props.subCategoryId !== subCategoryId
    );
  }

  async updateSubCategoryById({
    subCategoryId,
    categoryId,
    name
  }: UpdateSubCategoryProps): Promise<SubCategoryEntity> {
    const subCategoryIndex = this.items.findIndex(
      (subCategory) => subCategory.props.categoryId === subCategoryId
    );

    const subCategory = this.items[subCategoryIndex];

    if (name) subCategory.props.name = name;
    if (categoryId) subCategory.props.categoryId = categoryId;

    this.items[subCategoryIndex] = subCategory;

    return subCategory;
  }

  async getAllSubCategoriesByCategoryId(
    categoryId: number
  ): Promise<SubCategoryEntity[]> {
    return this.items.filter(
      (subCategory) => subCategory.props.categoryId === categoryId
    );
  }
}
