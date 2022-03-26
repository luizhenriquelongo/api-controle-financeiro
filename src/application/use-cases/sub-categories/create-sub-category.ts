import { ISubCategoriesRepository } from '../../repositories/SubCategoriesRepository';
import { ICategoriesRepository } from '../../repositories/CategoriesRepository';

type CreateSubCategoryUseCaseRequest = {
  subCategoryId: number;
  categoryId: number;
  name: string;
};

export class CreateSubCategoryUseCase {
  constructor(
    private categoriesRepository: ICategoriesRepository,
    private subCategoriesRepository: ISubCategoriesRepository
  ) {}
  async execute({
    subCategoryId,
    categoryId,
    name
  }: CreateSubCategoryUseCaseRequest) {
    const category = await this.categoriesRepository.findCategoryById(
      categoryId
    );
    if (!category)
      throw new Error(
        `Can't create a sub category: category id ${categoryId} does not exists.`
      );

    return await this.subCategoriesRepository.createSubCategory({
      subCategoryId,
      categoryId: category.props.categoryId,
      name
    });
  }
}
