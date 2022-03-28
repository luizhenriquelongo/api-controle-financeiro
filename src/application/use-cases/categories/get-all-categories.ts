import { ICategoriesRepository } from '../../repositories/categories.repository';

export class GetAllCategoriesUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}
  async execute() {
    return await this.categoriesRepository.getAllCategories();
  }
}
