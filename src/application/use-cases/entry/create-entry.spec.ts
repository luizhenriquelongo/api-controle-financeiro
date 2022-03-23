import { InMemoryEntriesRepository } from '../../../../tests/repositories/in-memory-entries-repository';
import { CreateEntryUseCase } from './create-entry';

describe('Create entry use case', () => {
  it('should be able to create a new entry use case', async () => {
    const repository = new InMemoryEntriesRepository();

    const useCase = new CreateEntryUseCase(repository);

    expect(repository.items.length).toBe(0);

    const response = await useCase.execute({
      entryId: 1,
      value: 12,
      date: new Date(),
      subCategoryId: 2,
      comment: 'some comment'
    });

    expect(response).toBeTruthy();
    expect(repository.items.length).toBe(1);
  });
});
