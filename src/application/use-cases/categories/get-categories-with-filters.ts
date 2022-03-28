import { ICategoriesRepository } from '../../repositories/categories.repository';
import { GetCategoriesFilter } from './types';

export class GetCategoriesWithFiltersUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}
  async execute(filters: GetCategoriesFilter) {
    return await this.categoriesRepository.getCategoriesWithFilters(filters);
  }
}
