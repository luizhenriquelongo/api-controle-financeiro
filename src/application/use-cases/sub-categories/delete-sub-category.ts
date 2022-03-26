import { ICategoriesRepository } from '../../repositories/CategoriesRepository';

type DeleteCategoryUseCaseRequest = {
  categoryId: number;
};

export class DeleteCategoryUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}
  async execute({ categoryId }: DeleteCategoryUseCaseRequest) {
    const category = await this.categoriesRepository.findCategoryById(
      categoryId
    );

    if (!category) {
      throw new Error("Can't delete category because category do not exists.");
    }

    await this.categoriesRepository.deleteCategoryById(categoryId);
  }
}
