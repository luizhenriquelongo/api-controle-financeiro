import { Entity } from '../../core/domain/Entity';
import Decimal from 'decimal.js';

export type EntryProps = {
  entryId: number;
  value: Decimal;
  date: Date;
  subCategoryId: number;
  comment: string | null;
};

export class EntryEntity extends Entity<EntryProps> {
  private constructor(props: EntryProps) {
    super(props);
  }

  static create(props: EntryProps) {
    return new EntryEntity(props);
  }

  public toDisplay() {
    return {
      id_lancamento: this.props.entryId,
      valor: this.props.value,
      data: this.props.date.toLocaleDateString('pt-BR'),
      id_subcategoria: this.props.subCategoryId,
      comentario: this.props.comment
    };
  }
}
