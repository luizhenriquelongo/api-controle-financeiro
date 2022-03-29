import { ISubCategoriesRepository } from '../../repositories/sub-categories.repository';
import { ICategoriesRepository } from '../../repositories/categories.repository';
import APIException from '../../exceptions/api.exception';

type CreateSubCategoryUseCaseRequest = {
  categoryId: number;
  name: string;
};

export class CreateSubCategoryUseCase {
  constructor(
    private categoriesRepository: ICategoriesRepository,
    private subCategoriesRepository: ISubCategoriesRepository
  ) {}
  async execute({ categoryId, name }: CreateSubCategoryUseCaseRequest) {
    const category = await this.categoriesRepository.findCategoryById(
      categoryId
    );
    if (!category)
      return new APIException(
        404,
        [
          `Não foi possível criar subcategoria: categoria com id ${categoryId} não existe.`
        ],
        'recurso_nao_encontrado'
      );

    return await this.subCategoriesRepository.createSubCategory({
      categoryId: category.props.categoryId,
      name
    });
  }
}
