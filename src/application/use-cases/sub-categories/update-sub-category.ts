import { ICategoriesRepository } from '../../repositories/categories.repository';
import { ISubCategoriesRepository } from '../../repositories/sub-categories.repository';
import APIException from '../../exceptions/api.exception';

type UpdateSubCategoryUseCaseRequest = {
  subCategoryId: number;
  categoryId?: number;
  name?: string;
};

export class UpdateSubCategoryUseCase {
  constructor(
    private categoriesRepository: ICategoriesRepository,
    private subCategoriesRepository: ISubCategoriesRepository
  ) {}
  async execute({
    subCategoryId,
    categoryId,
    name
  }: UpdateSubCategoryUseCaseRequest) {
    if (categoryId) {
      const category = await this.categoriesRepository.findCategoryById(
        categoryId
      );
      if (!category)
        return new APIException(
          404,
          [
            `Não foi possível atualizar subcategoria: categoria com id ${categoryId} não existe.`
          ],
          'recurso_nao_encontrado'
        );
    }
    const subCategory = await this.subCategoriesRepository.findSubCategoryById(
      subCategoryId
    );

    if (!subCategory) {
      return new APIException(
        404,
        [
          `Não foi possível atualizar subcategoria: Sub categoria com id ${subCategoryId} não existe.`
        ],
        'recurso_nao_encontrado'
      );
    }

    return await this.subCategoriesRepository.updateSubCategoryById({
      subCategoryId: subCategory.props.subCategoryId,
      categoryId,
      name
    });
  }
}
