import { CategoryEntity } from '../../src/domain/entities/category';
import { InMemoryCategoriesRepository } from './in-memory-categories-repository';
import { SubCategoryEntity } from '../../src/domain/entities/sub-category';
import { InMemorySubCategoriesRepository } from './in-memory-sub-categories-repository';

export const getInMemoryCategoriesRepository = async (
  entities: CategoryEntity[]
): Promise<InMemoryCategoriesRepository> => {
  const repository = new InMemoryCategoriesRepository();
  entities.forEach((entity) => repository.items.push(entity));
  return repository;
};

export const getInMemorySubCategoriesRepository = async (
  entities: SubCategoryEntity[]
): Promise<InMemorySubCategoriesRepository> => {
  const repository = new InMemorySubCategoriesRepository();
  entities.forEach((entity) => repository.items.push(entity));

  return repository;
};
