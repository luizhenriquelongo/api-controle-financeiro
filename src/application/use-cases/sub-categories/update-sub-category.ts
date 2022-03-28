import { ICategoriesRepository } from '../../repositories/categories.repository';
import { ISubCategoriesRepository } from '../../repositories/sub-categories.repository';

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
        throw new Error(
          `Can't update a sub category: category id ${categoryId} does not exists.`
        );
    }
    const subCategory = await this.subCategoriesRepository.findSubCategoryById(
      subCategoryId
    );

    if (!subCategory) {
      throw new Error(
        `Can't update sub category:  sub category id ${subCategoryId} does not exists.`
      );
    }

    return await this.subCategoriesRepository.updateSubCategoryById({
      subCategoryId: subCategory.props.subCategoryId,
      categoryId,
      name
    });
  }
}
