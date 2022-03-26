import { ISubCategoriesRepository } from '../../repositories/SubCategoriesRepository';

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
      throw new Error('Sub category not found.');
    }

    return subCategory;
  }
}
