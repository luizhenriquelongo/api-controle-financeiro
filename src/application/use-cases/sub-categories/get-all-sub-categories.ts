import { ISubCategoriesRepository } from '../../repositories/SubCategoriesRepository';

export class GetAllSubCategoriesUseCase {
  constructor(private subCategoriesRepository: ISubCategoriesRepository) {}
  async execute() {
    return await this.subCategoriesRepository.getAllSubCategories();
  }
}
