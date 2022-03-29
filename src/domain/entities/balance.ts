import { Entity } from '../../core/domain/Entity';
import { CategoryProps } from './category';
import Decimal from 'decimal.js';

type BalanceProps = {
  category?: CategoryProps;
  income: Decimal;
  expense: Decimal;
  balance: Decimal;
};

export class BalanceEntity extends Entity<BalanceProps> {
  private constructor(props: BalanceProps) {
    super(props);
  }

  static create(props: BalanceProps) {
    return new BalanceEntity(props);
  }

  public toDisplay() {
    const response: {
      receita: Decimal;
      despesa: Decimal;
      saldo: Decimal;
      categoria?: {
        id_categoria: number;
        nome: string;
      };
    } = {
      receita: this.props.income,
      despesa: this.props.expense,
      saldo: this.props.balance,
    };

    if (this.props.category)
      response.categoria = {
        id_categoria: this.props.category.categoryId,
        nome: this.props.category.name
      };
    return response;
  }
}
