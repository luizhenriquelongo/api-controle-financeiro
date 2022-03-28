import { Entity } from '../../core/domain/Entity';

export type EntryProps = {
  entryId: number;
  value: number;
  date: Date;
  subCategoryId: number;
  comment: string;
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
      data: this.props.date.toLocaleDateString(),
      id_subcategoria: this.props.subCategoryId,
      comentario: this.props.comment
    };
  }
}
