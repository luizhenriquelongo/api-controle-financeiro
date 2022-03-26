import { CategoryEntity } from '../../src/domain/entities/category';
import { InMemoryCategoriesRepository } from './in-memory-categories-repository';
import { SubCategoryEntity } from '../../src/domain/entities/sub-category';
import { InMemorySubCategoriesRepository } from './in-memory-sub-categories-repository';
import { EntryEntity } from '../../src/domain/entities/entry';
import { InMemoryEntriesRepository } from './in-memory-entries-repository';

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

export const getInMemoryEntriesRepository = async (
  entities: EntryEntity[]
): Promise<InMemoryEntriesRepository> => {
  const repository = new InMemoryEntriesRepository();
  entities.forEach((entity) => repository.items.push(entity));

  return repository;
};
