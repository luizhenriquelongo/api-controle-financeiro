import { ISubCategoriesRepository } from '../../repositories/sub-categories.repository';
import APIException from '../../exceptions/api.exception';

type DeleteSubCategoryUseCaseRequest = {
  subCategoryId: number;
};

export class DeleteSubCategoryUseCase {
  constructor(private subCategoriesRepository: ISubCategoriesRepository) {}
  async execute({ subCategoryId }: DeleteSubCategoryUseCaseRequest) {
    const subCategory = await this.subCategoriesRepository.findSubCategoryById(
      subCategoryId
    );

    if (!subCategory) {
      return new APIException(
        404,
        [
          `Não foi possível excluir subcategoria: Sub categoria com id ${subCategoryId} não existe.`
        ],
        'recurso_nao_encontrado'
      );
    }

    await this.subCategoriesRepository.deleteSubCategoryById(subCategoryId);
    return null;
  }
}
