import { Entity } from '../../core/domain/Entity';

export type CategoryProps = {
  categoryId: number;
  name: string;
};

export class CategoryEntity extends Entity<CategoryProps> {
  private constructor(props: CategoryProps) {
    super(props);
  }

  static create(props: CategoryProps) {
    return new CategoryEntity(props);
  }

  public toDisplay() {
    return {
      id_categoria: this.props.categoryId,
      nome: this.props.name
    };
  }
}
