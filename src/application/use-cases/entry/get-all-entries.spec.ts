import { InMemoryEntriesRepository } from '../../../../tests/repositories/in-memory-entries-repository';
import { EntryEntity } from '../../../domain/entities/entry';
import { GetAllEntriesUseCase } from './get-all-entries';

describe('Get all entries use case', () => {
  it('should be able to get all entries', async () => {
    const repository = new InMemoryEntriesRepository();
    const stored_entry = EntryEntity.create({
      entryId: 1,
      value: 12,
      date: new Date(),
      subCategoryId: 2,
      comment: 'some comment'
    });
    repository.items.push(stored_entry);

    const stored_entry2 = EntryEntity.create({
      entryId: 2,
      value: 13,
      date: new Date(),
      subCategoryId: 2,
      comment: 'some other comment'
    });
    repository.items.push(stored_entry2);

    const useCase = new GetAllEntriesUseCase(repository);

    const response = await useCase.execute();

    expect(response).toStrictEqual([stored_entry, stored_entry2]);
  });
});
