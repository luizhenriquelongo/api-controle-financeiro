import { Entity } from '../../core/domain/Entity';

export type SubCategoryProps = {
  categoryId: number;
  subCategoryId: number;
  name: string;
};

export class SubCategoryEntity extends Entity<SubCategoryProps> {
  private constructor(props: SubCategoryProps) {
    super(props);
  }

  static create(props: SubCategoryProps) {
    return new SubCategoryEntity(props);
  }

  public toDisplay() {
    return {
      id_subcategoria: this.props.subCategoryId,
      nome: this.props.name,
      id_categoria: this.props.categoryId
    };
  }
}
