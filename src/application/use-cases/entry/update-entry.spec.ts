import { InMemoryEntriesRepository } from '../../../../tests/repositories/in-memory-entries-repository';
import { EntryEntity } from '../../../domain/entities/entry';
import { UpdateEntryUseCase } from './update-entry';

describe('Update entry use case', () => {
  it('should be able to update an existent entry', async () => {
    const repository = new InMemoryEntriesRepository();
    const stored_entry = EntryEntity.create({
      entryId: 1,
      value: 12,
      date: new Date(),
      subCategoryId: 2,
      comment: 'some comment'
    });
    repository.items.push(stored_entry);

    expect(repository.items.length).toBe(1);
    expect(repository.items[0]).toStrictEqual(stored_entry);

    const useCase = new UpdateEntryUseCase(repository);

    const response = await useCase.execute({
      entryId: 1,
      value: 13,
      subCategoryId: 3,
      comment: 'some updated comment'
    });

    expect(repository.items.length).toBe(1);
    expect(response.props.value).toBe(13);
    expect(response.props.subCategoryId).toBe(3);
    expect(response.props.comment).toBe('some updated comment');
  });

  test('should throw an error if no entry was found', async () => {
    const repository = new InMemoryEntriesRepository();
    const stored_entry = EntryEntity.create({
      entryId: 1,
      value: 12,
      date: new Date(),
      subCategoryId: 2,
      comment: 'some comment'
    });
    repository.items.push(stored_entry);

    expect(repository.items.length).toBe(1);
    const useCase = new UpdateEntryUseCase(repository);

    expect(async () => {
      await useCase.execute({
        entryId: 2,
        value: 13,
        subCategoryId: 3,
        comment: 'some updated comment'
      });
    }).rejects.toThrow("Can't update entry because entry do not exists.");
    expect(repository.items.length).toBe(1);
    expect(repository.items[0]).toStrictEqual(stored_entry);
  });
});
