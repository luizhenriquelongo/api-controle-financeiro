import { ICategoriesRepository } from '../../repositories/CategoriesRepository';

type UpdateCategoryUseCaseRequest = {
  categoryId: number;
  name?: string;
};

export class UpdateCategoryUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}
  async execute({ categoryId, name }: UpdateCategoryUseCaseRequest) {
    const category = await this.categoriesRepository.findCategoryById(
      categoryId
    );

    if (!category) {
      throw new Error("Can't update category because category do not exists.");
    }

    return await this.categoriesRepository.updateCategoryById({
      categoryId: category.props.categoryId,
      name
    });
  }
}
