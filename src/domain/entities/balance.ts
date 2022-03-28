import { Entity } from '../../core/domain/Entity';
import { CategoryProps } from './category';

type BalanceProps = {
  category: CategoryProps;
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

  public toDisplay() {
    return {
      categoria: {
        id_categoria: this.props.category.categoryId,
        nome: this.props.category.name
      },
      receita: String(this.props.income),
      despesa: String(this.props.expense),
      saldo: String(this.props.balance)
    };
  }
}
