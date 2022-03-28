import { ICategoriesRepository } from '../../repositories/categories.repository';
import { CategoryEntity } from '../../../domain/entities/category';
import APIException from '../../exceptions/api.exception';

type UpdateCategoryUseCaseRequest = {
  categoryId: number;
  name: string;
};

export class UpdateCategoryUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}
  async execute({
    categoryId,
    name
  }: UpdateCategoryUseCaseRequest): Promise<CategoryEntity | APIException> {
    const category = await this.categoriesRepository.findCategoryById(
      categoryId
    );

    if (!category) {
      return new APIException(
        404,
        `Não foi possível editar categoria: Categoria com id ${categoryId} não existe.`,
        'recurso_nao_encontrado'
      );
    }

    return await this.categoriesRepository.updateCategoryById({
      categoryId: category.props.categoryId,
      name
    });
  }
}
