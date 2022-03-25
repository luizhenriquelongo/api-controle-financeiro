import { CategoryEntity, CategoryProps } from '../../domain/entities/category';

export type UpdateCategoryProps = {
  categoryId: number;
  name?: string;
};

export interface ICategoriesRepository {
  createCategory({ categoryId, name }: CategoryProps): Promise<CategoryEntity>;

  findCategoryById(categoryId: number): Promise<CategoryEntity | null>;

  getAllCategories(): Promise<CategoryEntity[]>;

  deleteCategoryById(entryId: number): Promise<void>;

  updateCategoryById({
    categoryId,
    name
  }: UpdateCategoryProps): Promise<CategoryEntity>;
}
