import { ICategoriesRepository } from '../../repositories/CategoriesRepository';

type GetCategoryUseCaseRequest = {
  categoryId: number;
};

export class GetCategoryUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}
  async execute({ categoryId }: GetCategoryUseCaseRequest) {
    const category = await this.categoriesRepository.findCategoryById(
      categoryId
    );

    if (!category) {
      throw new Error('Category not found.');
    }

    return category;
  }
}
