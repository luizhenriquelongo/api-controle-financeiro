import { ICategoriesRepository } from '../../repositories/categories.repository';
import { CategoryEntity } from '../../../domain/entities/category';
import APIException from '../../exceptions/api.exception';

type DeleteCategoryUseCaseRequest = {
  categoryId: number;
};

export class DeleteCategoryUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}
  async execute({
    categoryId
  }: DeleteCategoryUseCaseRequest): Promise<null | APIException> {
    const category = await this.categoriesRepository.findCategoryById(
      categoryId
    );

    if (!category) {
      return new APIException(
        404,
        `Can't delete category because category with id ${categoryId} do not exists.`
      );
    }

    await this.categoriesRepository.deleteCategoryById(categoryId);
    return null;
  }
}
