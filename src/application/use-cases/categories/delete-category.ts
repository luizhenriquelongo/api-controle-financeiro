import { ICategoriesRepository } from '../../repositories/categories.repository';
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
        `Não foi possível excluir categoria: Categoria com id ${categoryId} não existe.`,
        'recurso_nao_encontrado'
      );
    }

    await this.categoriesRepository.deleteCategoryById(categoryId);
    return null;
  }
}
