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
    const category = new CategoryEntity(props);

    return category;
  }
}
