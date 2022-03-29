import { GetSubCategoriesFilter } from './types';
import { ISubCategoriesRepository } from '../../repositories/sub-categories.repository';

export class GetSubCategoriesWithFiltersUseCase {
  constructor(private subCategoriesRepository: ISubCategoriesRepository) {}
  async execute(filters: GetSubCategoriesFilter) {
    return await this.subCategoriesRepository.getSubCategoriesWithFilters(
      filters
    );
  }
}
