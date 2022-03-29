import { InMemoryEntriesRepository } from '../../../../tests/repositories/in-memory-entries-repository';
import { EntryEntity } from '../../../domain/entities/entry';
import Decimal from 'decimal.js';
import { GetEntriesWithFiltersUseCase } from './get-all-entries-with-filters';

describe('Get all entries with filters use case', () => {
  it('should be able to get all entries with start_date filter', async () => {
    const repository = new InMemoryEntriesRepository();
    const storedEntry = EntryEntity.create({
      entryId: 1,
      value: new Decimal(12),
      date: new Date(2022, 3, 28),
      subCategoryId: 2,
      comment: 'some comment'
    });
    repository.items.push(storedEntry);

    const storedEntry2 = EntryEntity.create({
      entryId: 2,
      value: new Decimal(13),
      date: new Date(2022, 3, 27),
      subCategoryId: 2,
      comment: 'some other comment'
    });
    repository.items.push(storedEntry2);

    const useCase = new GetEntriesWithFiltersUseCase(repository);

    const response = await useCase.execute({
      start_date: new Date(2022, 3, 28)
    });

    expect(response).toStrictEqual([storedEntry]);
  });

  it('should be able to get all entries with end_date filter', async () => {
    const repository = new InMemoryEntriesRepository();
    const storedEntry = EntryEntity.create({
      entryId: 1,
      value: new Decimal(12),
      date: new Date(2022, 3, 28),
      subCategoryId: 2,
      comment: 'some comment'
    });
    repository.items.push(storedEntry);

    const storedEntry2 = EntryEntity.create({
      entryId: 2,
      value: new Decimal(13),
      date: new Date(2022, 3, 27),
      subCategoryId: 2,
      comment: 'some other comment'
    });
    repository.items.push(storedEntry2);

    const useCase = new GetEntriesWithFiltersUseCase(repository);

    const response = await useCase.execute({
      end_date: new Date(2022, 3, 27)
    });

    expect(response).toStrictEqual([storedEntry2]);
  });

  it('should be able to get all entries with date filters', async () => {
    const repository = new InMemoryEntriesRepository();
    const storedEntry = EntryEntity.create({
      entryId: 1,
      value: new Decimal(12),
      date: new Date(2022, 3, 28),
      subCategoryId: 2,
      comment: 'some comment'
    });
    repository.items.push(storedEntry);

    const storedEntry2 = EntryEntity.create({
      entryId: 2,
      value: new Decimal(13),
      date: new Date(2022, 3, 27),
      subCategoryId: 2,
      comment: 'some other comment'
    });
    repository.items.push(storedEntry2);

    const storedEntry3 = EntryEntity.create({
      entryId: 3,
      value: new Decimal(13),
      date: new Date(2022, 3, 26),
      subCategoryId: 2,
      comment: 'some other comment'
    });
    repository.items.push(storedEntry3);

    const storedEntry4 = EntryEntity.create({
      entryId: 3,
      value: new Decimal(13),
      date: new Date(2022, 3, 25),
      subCategoryId: 2,
      comment: 'some other comment'
    });
    repository.items.push(storedEntry4);

    const useCase = new GetEntriesWithFiltersUseCase(repository);

    const response = await useCase.execute({
      end_date: new Date(2022, 3, 27),
      start_date: new Date(2022, 3, 26)
    });

    expect(response).toStrictEqual([storedEntry2, storedEntry3]);
  });

  it('should be able to get all entries with all filters', async () => {
    const repository = new InMemoryEntriesRepository();
    const storedEntry = EntryEntity.create({
      entryId: 1,
      value: new Decimal(12),
      date: new Date(2022, 3, 28),
      subCategoryId: 2,
      comment: 'some comment'
    });
    repository.items.push(storedEntry);

    const storedEntry2 = EntryEntity.create({
      entryId: 2,
      value: new Decimal(13),
      date: new Date(2022, 3, 27),
      subCategoryId: 2,
      comment: 'some other comment'
    });
    repository.items.push(storedEntry2);

    const storedEntry3 = EntryEntity.create({
      entryId: 3,
      value: new Decimal(13),
      date: new Date(2022, 3, 26),
      subCategoryId: 3,
      comment: 'some other comment'
    });
    repository.items.push(storedEntry3);

    const storedEntry4 = EntryEntity.create({
      entryId: 3,
      value: new Decimal(13),
      date: new Date(2022, 3, 25),
      subCategoryId: 3,
      comment: 'some other comment'
    });
    repository.items.push(storedEntry4);

    const useCase = new GetEntriesWithFiltersUseCase(repository);

    const response = await useCase.execute({
      end_date: new Date(2022, 3, 27),
      start_date: new Date(2022, 3, 26),
      subCategoryId: 2
    });

    expect(response).toStrictEqual([storedEntry2]);
  });
});
