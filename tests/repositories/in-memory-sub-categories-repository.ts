import {
  ISubCategoriesRepository,
  UpdateSubCategoryProps
} from '../../src/application/repositories/SubCategoriesRepository';
import {
  SubCategoryEntity,
  SubCategoryProps
} from '../../src/domain/entities/sub-category';

export class InMemorySubCategoriesRepository
  implements ISubCategoriesRepository
{
  public items: SubCategoryEntity[] = [];

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
}
