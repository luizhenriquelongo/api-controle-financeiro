import { EntryEntity } from '../../../domain/entities/entry';
import { getInMemoryEntriesRepository } from '../../../../tests/repositories/utils';
import { GetBalanceByPeriodUseCase } from './get-balance-by-period';
import Decimal from 'decimal.js';

describe('Get balance by period use case', () => {
  it('should be able to get a balance', async () => {
    const storedEntry1 = EntryEntity.create({
      entryId: 1,
      value: new Decimal(100),
      date: new Date(2022, 3, 24),
      subCategoryId: 2,
      comment: 'some comment'
    });
    const storedEntry2 = EntryEntity.create({
      entryId: 2,
      value: new Decimal(-90),
      date: new Date(2022, 3, 25),
      subCategoryId: 2,
      comment: 'some comment'
    });
    const storedEntry3 = EntryEntity.create({
      entryId: 3,
      value: new Decimal(50),
      date: new Date(2022, 3, 26),
      subCategoryId: 2,
      comment: 'some comment'
    });
    const repository = await getInMemoryEntriesRepository([
      storedEntry1,
      storedEntry2,
      storedEntry3
    ]);

    const useCase = new GetBalanceByPeriodUseCase(repository);

    const response = await useCase.execute({
      startDate: new Date(2022, 3, 24),
      endDate: new Date(2022, 3, 26)
    });

    expect(response.props.expense).toStrictEqual(new Decimal(-90));
    expect(response.props.income).toStrictEqual(new Decimal(150));
    expect(response.props.balance).toStrictEqual(new Decimal(60));
  });

  it('should be able to get a balance filtering', async () => {
    const storedEntry1 = EntryEntity.create({
      entryId: 1,
      value: new Decimal(100),
      date: new Date(2022, 3, 24),
      subCategoryId: 2,
      comment: 'some comment'
    });
    const storedEntry2 = EntryEntity.create({
      entryId: 2,
      value: new Decimal(-90),
      date: new Date(2022, 3, 25),
      subCategoryId: 2,
      comment: 'some comment'
    });
    const storedEntry3 = EntryEntity.create({
      entryId: 3,
      value: new Decimal(50),
      date: new Date(2022, 3, 26),
      subCategoryId: 2,
      comment: 'some comment'
    });
    const repository = await getInMemoryEntriesRepository([
      storedEntry1,
      storedEntry2,
      storedEntry3
    ]);

    const useCase = new GetBalanceByPeriodUseCase(repository);

    const response = await useCase.execute({
      startDate: new Date(2022, 3, 25),
      endDate: new Date(2022, 3, 26)
    });

    expect(response.props.expense).toStrictEqual(new Decimal(-90));
    expect(response.props.income).toStrictEqual(new Decimal(50));
    expect(response.props.balance).toStrictEqual(new Decimal(-40));
  });
});
