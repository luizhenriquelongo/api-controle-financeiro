import { ICategoriesRepository } from '../../repositories/CategoriesRepository';

export class GetAllCategoriesUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}
  async execute() {
    return await this.categoriesRepository.getAllCategories();
  }
}
