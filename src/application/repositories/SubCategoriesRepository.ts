import {
  SubCategoryEntity,
  SubCategoryProps
} from '../../domain/entities/sub-category';

export type UpdateSubCategoryProps = {
  subCategoryId: number;
  categoryId?: number;
  name?: string;
};

export interface ISubCategoriesRepository {
  createSubCategory({
    subCategoryId,
    categoryId,
    name
  }: SubCategoryProps): Promise<SubCategoryEntity>;

  findSubCategoryById(subCategoryId: number): Promise<SubCategoryEntity | null>;

  getAllSubCategories(): Promise<SubCategoryEntity[]>;

  deleteSubCategoryById(subCategoryId: number): Promise<void>;

  updateSubCategoryById({
    subCategoryId,
    categoryId,
    name
  }: UpdateSubCategoryProps): Promise<SubCategoryEntity>;

  getAllSubCategoriesByCategoryId(
    categoryId: number
  ): Promise<SubCategoryEntity[]>;
}
