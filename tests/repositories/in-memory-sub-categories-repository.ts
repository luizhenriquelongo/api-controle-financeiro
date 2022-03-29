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
    return this.items.filter((category) => {
      const includesName = (name: string) => category.props.name.includes(name);
      const isTheSameId = (id: number) => category.props.subCategoryId === id;

      if (!filters.name && filters.subCategoryId)
        return isTheSameId(filters.subCategoryId);
      if (filters.name && !filters.subCategoryId)
        return includesName(filters.name);

      return (
        isTheSameId(<number>filters.subCategoryId) &&
        includesName(<string>filters.name)
      );
    });
  }

  async createSubCategory({
    subCategoryId,
    categoryId,
    name
  }: SubCategoryProps): Promise<SubCategoryEntity> {
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
