import { ISubCategoriesRepository } from '../../repositories/sub-categories.repository';

export class GetAllSubCategoriesUseCase {
  constructor(private subCategoriesRepository: ISubCategoriesRepository) {}
  async execute() {
    return await this.subCategoriesRepository.getAllSubCategories();
  }
}
