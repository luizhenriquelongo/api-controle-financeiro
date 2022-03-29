import { GetEntriesFilter } from './types';
import { IEntriesRepository } from '../../repositories/entries.repository';

export class GetEntriesWithFiltersUseCase {
  constructor(private entriesRepository: IEntriesRepository) {}
  async execute(filters: GetEntriesFilter) {
    return await this.entriesRepository.getEntriesWithFilters(filters);
  }
}
