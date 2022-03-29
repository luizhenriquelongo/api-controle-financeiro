import { InMemoryEntriesRepository } from '../../../../tests/repositories/in-memory-entries-repository';
import { CreateEntryUseCase } from './create-entry';
import { SubCategoryEntity } from '../../../domain/entities/sub-category';
import { getInMemorySubCategoriesRepository } from '../../../../tests/repositories/utils';
import Decimal from 'decimal.js';
import APIException from '../../exceptions/api.exception';

describe('Create entry use case', () => {
  it('should be able to create a new entry', async () => {
    const entriesRepository = new InMemoryEntriesRepository();
    const storedSubCategory = SubCategoryEntity.create({
      subCategoryId: 1,
      categoryId: 1,
      name: 'Sub Category 1'
    });
    const subCategoriesRepository = await getInMemorySubCategoriesRepository([
      storedSubCategory
    ]);
    const useCase = new CreateEntryUseCase(
      entriesRepository,
      subCategoriesRepository
    );

    expect(entriesRepository.items.length).toBe(0);

    const response = await useCase.execute({
      value: new Decimal(12),
      date: new Date(),
      subCategoryId: 1,
      comment: 'some comment'
    });

    expect(response).not.toBeInstanceOf(APIException);
    expect(entriesRepository.items.length).toBe(1);
  });
});
