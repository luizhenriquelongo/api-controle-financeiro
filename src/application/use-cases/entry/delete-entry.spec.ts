import { InMemoryEntriesRepository } from '../../../../tests/repositories/in-memory-entries-repository';
import { EntryEntity } from '../../../domain/entities/entry';
import { DeleteEntryUseCase } from './delete-entry';

describe('Delete entry use case', () => {
  it('should be able to delete an existent entry', async () => {
    const repository = new InMemoryEntriesRepository();
    const storedEntry = EntryEntity.create({
      entryId: 1,
      value: 12,
      date: new Date(),
      subCategoryId: 2,
      comment: 'some comment'
    });
    repository.items.push(storedEntry);

    expect(repository.items.length).toBe(1);

    const useCase = new DeleteEntryUseCase(repository);

    await useCase.execute({ entryId: 1 });

    expect(repository.items.length).toBe(0);
  });

  test('should throw an error if no entry was found', async () => {
    const repository = new InMemoryEntriesRepository();
    const storedEntry = EntryEntity.create({
      entryId: 1,
      value: 12,
      date: new Date(),
      subCategoryId: 2,
      comment: 'some comment'
    });
    repository.items.push(storedEntry);

    expect(repository.items.length).toBe(1);
    const useCase = new DeleteEntryUseCase(repository);

    await expect(async () => {
      await useCase.execute({ entryId: 2 });
    }).rejects.toThrow("Can't delete entry because entry do not exists.");
    expect(repository.items.length).toBe(1);
  });
});
