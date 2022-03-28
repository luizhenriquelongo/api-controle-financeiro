import { IEntriesRepository } from '../../repositories/entries.repository';
import { BalanceEntity } from '../../../domain/entities/balance';

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
      if (entity.props.value > 0) return partialSum + entity.props.value;
      return partialSum;
    }, 0);
    const expense = entries.reduce((partialSum, entity) => {
      if (entity.props.value < 0) return partialSum + entity.props.value;
      return partialSum;
    }, 0);
    const balanceSum = entries.reduce(
      (partialSum, entity) => partialSum + entity.props.value,
      0
    );

    return BalanceEntity.create({
      income,
      expense,
      balance: balanceSum
    });
  }
}
