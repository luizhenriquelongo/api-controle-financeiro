import { CreateEntryUseCase } from './create-entry';

describe('Create entry use case', () => {
  it('should be able to create a new entry use case', async () => {
    const useCase = new CreateEntryUseCase();

    const response = await useCase.execute({
      entryId: 1,
      value: 12,
      date: new Date(),
      subCategoryId: 2,
      comment: 'some comment'
    });

    expect(response).toBeTruthy();
  });
});
