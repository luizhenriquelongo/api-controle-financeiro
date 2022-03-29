import { InMemoryEntriesRepository } from '../../../../tests/repositories/in-memory-entries-repository';
import { EntryEntity } from '../../../domain/entities/entry';
import { UpdateEntryUseCase } from './update-entry';
import Decimal from 'decimal.js';
import { getInMemorySubCategoriesRepository } from '../../../../tests/repositories/utils';
import { SubCategoryEntity } from '../../../domain/entities/sub-category';
import APIException from '../../exceptions/api.exception';

describe('Update entry use case', () => {
  it('should be able to update an existent entry', async () => {
    const entriesRepository = new InMemoryEntriesRepository();
    const storedEntry = EntryEntity.create({
      entryId: 1,
      value: new Decimal(12),
      date: new Date(),
      subCategoryId: 2,
      comment: 'some comment'
    });
    entriesRepository.items.push(storedEntry);

    const storedSubCategory = SubCategoryEntity.create({
      subCategoryId: 1,
      categoryId: 1,
      name: 'Sub Category 1'
    });
    const subCategoriesRepository = await getInMemorySubCategoriesRepository([
      storedSubCategory
    ]);

    expect(entriesRepository.items.length).toBe(1);
    expect(entriesRepository.items[0]).toStrictEqual(storedEntry);

    const useCase = new UpdateEntryUseCase(
      entriesRepository,
      subCategoriesRepository
    );

    const response = (await useCase.execute({
      entryId: 1,
      value: new Decimal(13),
      subCategoryId: 1,
      comment: 'some updated comment'
    })) as EntryEntity;

    expect(entriesRepository.items.length).toBe(1);
    expect(response.props.value).toStrictEqual(new Decimal(13));
    expect(response.props.subCategoryId).toBe(1);
    expect(response.props.comment).toBe('some updated comment');
  });

  test('should throw an error if no entry was found', async () => {
    const entriesRepository = new InMemoryEntriesRepository();
    const storedEntry = EntryEntity.create({
      entryId: 1,
      value: new Decimal(12),
      date: new Date(),
      subCategoryId: 2,
      comment: 'some comment'
    });
    entriesRepository.items.push(storedEntry);

    const storedSubCategory = SubCategoryEntity.create({
      subCategoryId: 1,
      categoryId: 1,
      name: 'Sub Category 1'
    });
    const subCategoriesRepository = await getInMemorySubCategoriesRepository([
      storedSubCategory
    ]);

    expect(entriesRepository.items.length).toBe(1);
    const useCase = new UpdateEntryUseCase(
      entriesRepository,
      subCategoriesRepository
    );

    const result = await useCase.execute({
      entryId: 2,
      value: new Decimal(13),
      subCategoryId: 1,
      comment: 'some updated comment'
    });
    expect(result).toBeInstanceOf(APIException);
    expect(entriesRepository.items.length).toBe(1);
    expect(entriesRepository.items[0]).toStrictEqual(storedEntry);
  });

  test('should throw an error if no subcategory was found', async () => {
    const entriesRepository = new InMemoryEntriesRepository();
    const storedEntry = EntryEntity.create({
      entryId: 1,
      value: new Decimal(12),
      date: new Date(),
      subCategoryId: 2,
      comment: 'some comment'
    });
    entriesRepository.items.push(storedEntry);

    const storedSubCategory = SubCategoryEntity.create({
      subCategoryId: 1,
      categoryId: 1,
      name: 'Sub Category 1'
    });
    const subCategoriesRepository = await getInMemorySubCategoriesRepository([
      storedSubCategory
    ]);

    expect(entriesRepository.items.length).toBe(1);
    const useCase = new UpdateEntryUseCase(
      entriesRepository,
      subCategoriesRepository
    );

    const result = await useCase.execute({
      entryId: storedEntry.props.entryId,
      value: new Decimal(13),
      subCategoryId: 2,
      comment: 'some updated comment'
    });
    expect(result).toBeInstanceOf(APIException);
    expect(entriesRepository.items.length).toBe(1);
    expect(entriesRepository.items[0]).toStrictEqual(storedEntry);
  });
});
