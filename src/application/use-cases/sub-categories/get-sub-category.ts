import { ISubCategoriesRepository } from '../../repositories/sub-categories.repository';
import APIException from '../../exceptions/api.exception';

type GetSubCategoryUseCaseRequest = {
  subCategoryId: number;
};

export class GetSubCategoryUseCase {
  constructor(private subCategoriesRepository: ISubCategoriesRepository) {}
  async execute({ subCategoryId }: GetSubCategoryUseCaseRequest) {
    const subCategory = await this.subCategoriesRepository.findSubCategoryById(
      subCategoryId
    );

    if (!subCategory) {
      return new APIException(
        404,
        [`Sub categoria com id ${subCategoryId} não existe.`],
        'recurso_nao_encontrado'
      );
    }

    return subCategory;
  }
}
