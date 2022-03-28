import { CategoryEntity, CategoryProps } from '../../domain/entities/category';
import { postgresDataSource } from '../../database/data-source';
import { CategoryDBEntity } from '../../database/entities/category.entity';
import { GetCategoriesFilter } from '../use-cases/categories/types';
import { Like } from 'typeorm';

export interface ICategoriesRepository {
  createCategory({ name }: { name: string }): Promise<CategoryEntity>;

  findCategoryById(categoryId: number): Promise<CategoryEntity | null>;

  getAllCategories(): Promise<CategoryEntity[]>;

  deleteCategoryById(categoryId: number): Promise<void>;

  updateCategoryById({
    categoryId,
    name
  }: CategoryProps): Promise<CategoryEntity>;

  getCategoriesWithFilters(
    filters: GetCategoriesFilter
  ): Promise<CategoryEntity[]>;
}

export class CategoriesPostgresRepository implements ICategoriesRepository {
  async createCategory({ name }: { name: string }): Promise<CategoryEntity> {
    const category = await postgresDataSource
      .getRepository(CategoryDBEntity)
      .create({ name: name });

    const result = await postgresDataSource
      .getRepository(CategoryDBEntity)
      .save(category);

    return CategoryEntity.create({
      categoryId: result.id,
      name: result.name
    });
  }

  async deleteCategoryById(categoryId: number): Promise<void> {
    await postgresDataSource.getRepository(CategoryDBEntity).delete(categoryId);
  }

  async findCategoryById(categoryId: number): Promise<CategoryEntity | null> {
    const category = await postgresDataSource
      .getRepository(CategoryDBEntity)
      .findOneBy({ id: categoryId });

    if (!category) return null;

    return CategoryEntity.create({
      categoryId: category.id,
      name: category.name
    });
  }

  async getAllCategories(): Promise<CategoryEntity[]> {
    const categories = await postgresDataSource
      .getRepository(CategoryDBEntity)
      .find();

    return categories.map((category) => {
      return CategoryEntity.create({
        categoryId: category.id,
        name: category.name
      });
    });
  }

  async updateCategoryById({
    categoryId,
    name
  }: CategoryProps): Promise<CategoryEntity> {
    const category = (await postgresDataSource
      .getRepository(CategoryDBEntity)
      .findOneBy({
        id: categoryId
      })) as CategoryDBEntity;

    postgresDataSource
      .getRepository(CategoryDBEntity)
      .merge(category, { name: name });
    const result = await postgresDataSource
      .getRepository(CategoryDBEntity)
      .save(category);

    return CategoryEntity.create({
      categoryId: result.id,
      name: result.name
    });
  }

  async getCategoriesWithFilters(
    filters: GetCategoriesFilter
  ): Promise<CategoryEntity[]> {
    const categories = await postgresDataSource
      .getRepository(CategoryDBEntity)
      .findBy({ name: Like(`%${filters.name}%`) });

    return categories.map((category) =>
      CategoryEntity.create({
        categoryId: category.id,
        name: category.name
      })
    );
  }
}
