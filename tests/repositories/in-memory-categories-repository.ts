import {
  CategoryEntity,
  CategoryProps
} from '../../src/domain/entities/category';
import {
  ICategoriesRepository,
  UpdateCategoryProps
} from '../../src/application/repositories/CategoriesRepository';

export class InMemoryCategoriesRepository implements ICategoriesRepository {
  public items: CategoryEntity[] = [];

  async createCategory({
    categoryId,
    name
  }: CategoryProps): Promise<CategoryEntity> {
    const category = CategoryEntity.create({
      categoryId,
      name
    });
    this.items.push(category);

    return category;
  }

  async findCategoryById(categoryId: number): Promise<CategoryEntity | null> {
    const category = this.items.find(
      (category) => category.props.categoryId === categoryId
    );

    if (!category) return null;

    return category;
  }

  async getAllCategories(): Promise<CategoryEntity[]> {
    return this.items;
  }

  async deleteCategoryById(categoryId: number): Promise<void> {
    this.items = this.items.filter(
      (category) => category.props.categoryId !== categoryId
    );
  }

  async updateCategoryById({
    categoryId,
    name
  }: UpdateCategoryProps): Promise<CategoryEntity> {
    const categoryIndex = this.items.findIndex(
      (category) => category.props.categoryId === categoryId
    );
    const category = this.items[categoryIndex];

    if (name) category.props.name = name;

    this.items[categoryIndex] = category;

    return category;
  }
}
