import { ICategoriesRepository } from '../../repositories/categories.repository';
import { CategoryEntity } from '../../../domain/entities/category';
import APIException from '../../exceptions/api.exception';

type GetCategoryUseCaseRequest = {
  categoryId: number;
};

export class GetCategoryUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}
  async execute({
    categoryId
  }: GetCategoryUseCaseRequest): Promise<CategoryEntity | APIException> {
    const category = await this.categoriesRepository.findCategoryById(
      categoryId
    );

    if (!category) {
      return new APIException(
        404,
        [`Categoria com id ${categoryId} não existe.`],
        'recurso_nao_encontrado'
      );
    }

    return category;
  }
}
