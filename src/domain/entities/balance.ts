import { Entity } from '../../core/domain/Entity';
import { CategoryProps } from './category';

type BalanceProps = {
  category?: CategoryProps;
  income: number;
  expense: number;
  balance: number;
};

export class BalanceEntity extends Entity<BalanceProps> {
  private constructor(props: BalanceProps) {
    super(props);
  }

  static create(props: BalanceProps) {
    return new BalanceEntity(props);
  }
}
