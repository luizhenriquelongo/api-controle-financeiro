import { InMemoryEntriesRepository } from '../../../../tests/repositories/in-memory-entries-repository';
import { EntryEntity } from '../../../domain/entities/entry';
import { GetEntryUseCase } from './get-entry';
import Decimal from 'decimal.js';
import APIException from '../../exceptions/api.exception';

describe('Get entry use case', () => {
  it('should be able to get an entry', async () => {
    const repository = new InMemoryEntriesRepository();
    const storedEntry = EntryEntity.create({
      entryId: 1,
      value: new Decimal(12),
      date: new Date(),
      subCategoryId: 2,
      comment: 'some comment'
    });
    repository.items.push(storedEntry);

    const useCase = new GetEntryUseCase(repository);

    const response = await useCase.execute({
      entryId: 1
    });

    expect(response).toBe(storedEntry);
  });

  test('should throw an error if no entry was found', async () => {
    const repository = new InMemoryEntriesRepository();
    const storedEntry = EntryEntity.create({
      entryId: 1,
      value: new Decimal(12),
      date: new Date(),
      subCategoryId: 2,
      comment: 'some comment'
    });
    repository.items.push(storedEntry);

    const useCase = new GetEntryUseCase(repository);

    const result = await useCase.execute({ entryId: 2 });
    expect(result).toBeInstanceOf(APIException);
  });
});
