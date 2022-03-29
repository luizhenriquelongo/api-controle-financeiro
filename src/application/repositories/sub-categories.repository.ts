import { SubCategoryEntity } from '../../domain/entities/sub-category';
import { GetSubCategoriesFilter } from '../use-cases/sub-categories/types';
import { postgresDataSource } from '../../database/data-source';
import { CategoryDBEntity } from '../../database/entities/category.entity';
import { SubCategoryDBEntity } from '../../database/entities/sub-category.entity';
import { FindOperator, ILike } from 'typeorm';
import APIException from '../exceptions/api.exception';

export type UpdateSubCategoryProps = {
  subCategoryId: number;
  categoryId?: number;
  name?: string;
};

export interface ISubCategoriesRepository {
  createSubCategory({
    categoryId,
    name
  }: {
    categoryId: number;
    name: string;
  }): Promise<SubCategoryEntity | APIException>;

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

  getSubCategoriesWithFilters(
    filters: GetSubCategoriesFilter
  ): Promise<SubCategoryEntity[]>;
}

export class SubCategoriesPostgresRepository
  implements ISubCategoriesRepository
{
  async createSubCategory({
    categoryId,
    name
  }: {
    categoryId: number;
    name: string;
  }): Promise<SubCategoryEntity> {
    const subCategory = await postgresDataSource
      .getRepository(SubCategoryDBEntity)
      .create({ name: name, category_id: categoryId });

    const result = await postgresDataSource
      .getRepository(SubCategoryDBEntity)
      .save(subCategory);

    return SubCategoryEntity.create({
      subCategoryId: result.id,
      categoryId: result.category_id,
      name: result.name
    });
  }

  async deleteSubCategoryById(subCategoryId: number): Promise<void> {
    await postgresDataSource
      .getRepository(SubCategoryDBEntity)
      .delete(subCategoryId);
  }

  async findSubCategoryById(
    subCategoryId: number
  ): Promise<SubCategoryEntity | null> {
    const subCategory = await postgresDataSource
      .getRepository(SubCategoryDBEntity)
      .findOneBy({ id: subCategoryId });

    if (!subCategory) return null;

    return SubCategoryEntity.create({
      subCategoryId: subCategory.id,
      categoryId: subCategory.category_id,
      name: subCategory.name
    });
  }

  async getAllSubCategories(): Promise<SubCategoryEntity[]> {
    const subCategories = await postgresDataSource
      .getRepository(SubCategoryDBEntity)
      .find();

    return subCategories.map((subCategory) => {
      return SubCategoryEntity.create({
        subCategoryId: subCategory.id,
        categoryId: subCategory.category_id,
        name: subCategory.name
      });
    });
  }

  async getAllSubCategoriesByCategoryId(
    categoryId: number
  ): Promise<SubCategoryEntity[]> {
    const category = (await postgresDataSource
      .getRepository(CategoryDBEntity)
      .findOneBy({ id: categoryId })) as CategoryDBEntity;

    const subCategories = await postgresDataSource
      .getRepository(SubCategoryDBEntity)
      .findBy({ category_id: category.id });

    return subCategories.map((subCategory) =>
      SubCategoryEntity.create({
        subCategoryId: subCategory.id,
        categoryId: subCategory.category_id,
        name: subCategory.name
      })
    );
  }

  async getSubCategoriesWithFilters(
    filters: GetSubCategoriesFilter
  ): Promise<SubCategoryEntity[]> {
    const where: { name?: FindOperator<string>; id?: number } = {};
    if (filters.name) where.name = ILike(`%${filters.name}%`);
    if (filters.subCategoryId) where.id = filters.subCategoryId;

    const subCategories = await postgresDataSource
      .getRepository(SubCategoryDBEntity)
      .findBy(where);

    return subCategories.map((subCategory) =>
      SubCategoryEntity.create({
        subCategoryId: subCategory.id,
        categoryId: subCategory.category_id,
        name: subCategory.name
      })
    );
  }

  async updateSubCategoryById({
    subCategoryId,
    categoryId,
    name
  }: UpdateSubCategoryProps): Promise<SubCategoryEntity> {
    const subCategory = (await postgresDataSource
      .getRepository(SubCategoryDBEntity)
      .findOneBy({
        id: subCategoryId
      })) as SubCategoryDBEntity;

    const toUpdate: { name?: string; category_id?: number } = {};
    if (name) toUpdate.name = name;
    if (categoryId) toUpdate.category_id = categoryId;

    postgresDataSource
      .getRepository(SubCategoryDBEntity)
      .merge(subCategory, toUpdate);
    const result = await postgresDataSource
      .getRepository(SubCategoryDBEntity)
      .save(subCategory);

    return SubCategoryEntity.create({
      subCategoryId: result.id,
      categoryId: result.category_id,
      name: result.name
    });
  }
}
