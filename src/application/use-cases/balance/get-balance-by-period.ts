import { IEntriesRepository } from '../../repositories/entries.repository';
import { BalanceEntity } from '../../../domain/entities/balance';
import Decimal from 'decimal.js';

export type GetBalanceByPeriodUseCaseRequest = {
  startDate: Date;
  endDate: Date;
};

export class GetBalanceByPeriodUseCase {
  constructor(private entriesRepository: IEntriesRepository) {}
  async execute({ startDate, endDate }: GetBalanceByPeriodUseCaseRequest) {
    const entries = await this.entriesRepository.findEntriesByPeriod({
      startDate,
      endDate
    });
    const income = entries.reduce((partialSum, entity) => {
      if (entity.props.value.toNumber() > 0)
        return partialSum + entity.props.value.toNumber();
      return partialSum;
    }, 0);
    const expense = entries.reduce((partialSum, entity) => {
      if (entity.props.value.toNumber() < 0)
        return partialSum + entity.props.value.toNumber();
      return partialSum;
    }, 0);
    const balanceSum = entries.reduce(
      (partialSum, entity) => partialSum + entity.props.value.toNumber(),
      0
    );

    return BalanceEntity.create({
      income: new Decimal(income),
      expense: new Decimal(expense),
      balance: new Decimal(balanceSum)
    });
  }
}
