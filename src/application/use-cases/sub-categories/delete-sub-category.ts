import { ISubCategoriesRepository } from '../../repositories/SubCategoriesRepository';

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
      throw new Error(
        "Can't delete sub category because sub category do not exists."
      );
    }

    await this.subCategoriesRepository.deleteSubCategoryById(subCategoryId);
  }
}
